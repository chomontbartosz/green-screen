// API — wszystkie adresy /api/… w jednym miejscu. Te same funkcje działają na Vercelu (api/[route].ts)
// i lokalnie w `npm run dev` (server/devPlugin.ts).
//
//   GET   /api/me        → zalogowany użytkownik i jego dane (albo { user: null })
//   POST  /api/register  → { email, password, db } zakłada konto z danymi z przeglądarki
//   POST  /api/login     → { email, password, db } loguje; dni z przeglądarki, których nie ma na koncie, są dopisywane
//   POST  /api/logout    → wylogowanie
//   PATCH /api/db        → { settings?, days? } zapis zmian (tylko zalogowani)
//   GET   /api/verify    → ?token=… potwierdzenie adresu z maila
//   POST  /api/forgot    → { email } wysyła link do zmiany hasła
//   POST  /api/reset     → { token, password } ustawia nowe hasło i loguje

import type { IncomingMessage, ServerResponse } from 'node:http'
import { applyChanges, normalizeDb } from '../src/data/changes.js'
import type { Database, DbChanges } from '../src/types.js'
import { checkPassword, clearSession, hashPassword, randomToken, readSession, setSession } from './auth.js'
import { AUTH } from './config.js'
import * as users from './database.js'
import { sendPasswordReset, sendWelcome } from './mail.js'

type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void>

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

// --- pomocnicze -------------------------------------------------------------

async function readBody<T>(req: IncomingMessage): Promise<T> {
  const parsed = (req as IncomingMessage & { body?: unknown }).body // Vercel parsuje JSON sam
  if (parsed !== undefined) return (typeof parsed === 'string' ? JSON.parse(parsed) : parsed) as T
  let raw = ''
  for await (const chunk of req) raw += chunk
  return (raw ? JSON.parse(raw) : {}) as T
}

const reply = (res: ServerResponse, status: number, data: unknown) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

const origin = (req: IncomingMessage) => `${req.headers['x-forwarded-proto'] ?? 'http'}://${req.headers.host}`
const query = (req: IncomingMessage) => new URL(req.url ?? '/', 'http://x').searchParams

const normalizeEmail = (email: unknown) => String(email ?? '').trim().toLowerCase()
const publicUser = (u: users.UserRow) => ({ email: u.email, guestName: u.guest_name, verified: u.verified })

function validateCredentials(email: string, password: unknown) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Podaj poprawny adres e-mail.')
  if (typeof password !== 'string' || password.length < AUTH.passwordMinLength)
    throw new HttpError(400, `Hasło musi mieć co najmniej ${AUTH.passwordMinLength} znaków.`)
}

async function requireUser(req: IncomingMessage) {
  const id = readSession(req)
  const user = id ? await users.findUserById(id) : null
  if (!user) throw new HttpError(401, 'Zaloguj się ponownie.')
  return user
}

/** Dni z przeglądarki, których nie ma jeszcze na koncie. */
const missingDays = (account: Database, guest: Database) => Object.fromEntries(Object.entries(guest.days).filter(([date]) => !account.days[date]))

// --- adresy API -------------------------------------------------------------

const ROUTES: Record<string, { method: string; handler: Handler }> = {
  me: {
    method: 'GET',
    handler: async (req, res) => {
      const id = readSession(req)
      const user = id ? await users.findUserById(id) : null
      reply(res, 200, user ? { user: publicUser(user), db: normalizeDb(user.data) } : { user: null })
    },
  },

  register: {
    method: 'POST',
    handler: async (req, res) => {
      const body = await readBody<{ email: string; password: string; guestName: string; db: Database }>(req)
      const email = normalizeEmail(body.email)
      validateCredentials(email, body.password)
      const exists = new HttpError(409, 'Konto z tym adresem już istnieje — zaloguj się.')
      if (await users.findUserByEmail(email)) throw exists
      const verifyToken = randomToken()
      const user = await users
        .createUser({
          email,
          passwordHash: await hashPassword(body.password),
          guestName: String(body.guestName ?? '').slice(0, 32) || 'user',
          verifyToken,
          data: normalizeDb(body.db),
        })
        .catch((error) => {
          throw error instanceof users.DuplicateError ? exists : error // dwie rejestracje naraz
        })
      await sendWelcome(email, `${origin(req)}/api/verify?token=${verifyToken}`)
      setSession(req, res, user.id)
      reply(res, 201, { user: publicUser(user), db: normalizeDb(user.data) })
    },
  },

  login: {
    method: 'POST',
    handler: async (req, res) => {
      const body = await readBody<{ email: string; password: string; db?: Database }>(req)
      const user = await users.findUserByEmail(normalizeEmail(body.email))
      if (user?.locked_until && user.locked_until > new Date())
        throw new HttpError(429, `Za dużo prób. Spróbuj ponownie za ${AUTH.lockMinutes} min.`)
      if (!user || !(await checkPassword(String(body.password ?? ''), user.password_hash))) {
        if (user) {
          const lock = user.failed_logins + 1 >= AUTH.maxFailedLogins ? new Date(Date.now() + AUTH.lockMinutes * 60000) : null
          await users.recordFailedLogin(user.id, lock)
        }
        throw new HttpError(401, 'Nieprawidłowy e-mail lub hasło.')
      }
      await users.clearFailedLogins(user.id)
      const account = normalizeDb(user.data)
      const merged = body.db ? applyChanges(account, { days: missingDays(account, normalizeDb(body.db)) }) : account
      if (merged !== account) await users.saveUserData(user.id, merged)
      setSession(req, res, user.id)
      reply(res, 200, { user: publicUser(user), db: merged })
    },
  },

  logout: {
    method: 'POST',
    handler: async (_req, res) => {
      clearSession(res)
      reply(res, 200, { ok: true })
    },
  },

  db: {
    method: 'PATCH',
    handler: async (req, res) => {
      const user = await requireUser(req)
      const changes = await readBody<DbChanges>(req)
      await users.saveUserData(user.id, applyChanges(normalizeDb(user.data), changes))
      reply(res, 200, { ok: true })
    },
  },

  verify: {
    method: 'GET',
    handler: async (req, res) => {
      const user = await users.findUserByVerifyToken(query(req).get('token') ?? '')
      if (user) await users.markVerified(user.id)
      res.statusCode = 302
      res.setHeader('Location', user ? '/?verified=1' : '/?verified=0')
      res.end()
    },
  },

  forgot: {
    method: 'POST',
    handler: async (req, res) => {
      const { email } = await readBody<{ email: string }>(req)
      const user = await users.findUserByEmail(normalizeEmail(email))
      if (user) {
        const token = randomToken()
        await users.setResetToken(user.id, token, new Date(Date.now() + AUTH.resetLinkHours * 3600000))
        await sendPasswordReset(user.email, `${origin(req)}/?reset=${token}`)
      }
      reply(res, 200, { ok: true }) // ta sama odpowiedź, czy konto istnieje, czy nie
    },
  },

  reset: {
    method: 'POST',
    handler: async (req, res) => {
      const { token, password } = await readBody<{ token: string; password: string }>(req)
      const user = await users.findUserByResetToken(String(token ?? ''))
      if (!user) throw new HttpError(400, 'Link wygasł albo został już użyty. Poproś o nowy.')
      validateCredentials(user.email, password)
      await users.setPassword(user.id, await hashPassword(password))
      setSession(req, res, user.id)
      reply(res, 200, { user: publicUser(user), db: normalizeDb(user.data) })
    },
  },
}

/** Obsługa jednego adresu /api/<nazwa> z czytelnymi błędami. */
export async function handleApi(name: string, req: IncomingMessage, res: ServerResponse) {
  const route = ROUTES[name]
  try {
    if (!route) throw new HttpError(404, 'Nie ma takiego adresu.')
    if (req.method !== route.method) throw new HttpError(405, 'Niedozwolona metoda.')
    await route.handler(req, res)
  } catch (error) {
    if (error instanceof HttpError) return reply(res, error.status, { error: error.message })
    console.error(`[api/${name}]`, error)
    reply(res, 500, { error: 'Coś poszło nie tak po stronie serwera. Spróbuj za chwilę.' })
  }
}
