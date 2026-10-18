// LOGOWANIE — hasła (bcrypt), podpisane ciasteczko sesji i losowe tokeny do linków w mailach.
// Hasło nigdy nie jest zapisywane ani wysyłane jawnie — w bazie jest tylko jego skrót (hash).

import bcrypt from 'bcryptjs'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { AUTH } from './config.js'

export const hashPassword = (password: string) => bcrypt.hash(password, 10)
export const checkPassword = (password: string, hash: string) => bcrypt.compare(password, hash)
export const randomToken = () => randomBytes(24).toString('hex')

const sign = (payload: string) => createHmac('sha256', AUTH.secret()).update(payload).digest('hex')

/** Ciasteczko: „idUżytkownika.wygaśnięcie.podpis” — bez podpisu nie da się go podrobić. */
export function setSession(req: IncomingMessage, res: ServerResponse, userId: number) {
  const expires = Date.now() + AUTH.sessionDays * 24 * 60 * 60 * 1000
  const payload = `${userId}.${expires}`
  const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${AUTH.cookie}=${payload}.${sign(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${AUTH.sessionDays * 86400}${secure}`)
}

export function clearSession(res: ServerResponse) {
  res.setHeader('Set-Cookie', `${AUTH.cookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}

/** Id zalogowanego użytkownika albo null. */
export function readSession(req: IncomingMessage): number | null {
  const cookie = (req.headers.cookie ?? '').split('; ').find((c) => c.startsWith(`${AUTH.cookie}=`))
  const [id, expires, signature] = cookie?.slice(AUTH.cookie.length + 1).split('.') ?? []
  if (!id || !expires || !signature || Number(expires) < Date.now()) return null
  const expected = sign(`${id}.${expires}`)
  const valid = expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  return valid ? Number(id) : null
}
