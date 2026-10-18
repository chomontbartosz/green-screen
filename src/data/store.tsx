// Stan aplikacji dostępny na każdym ekranie przez useStore().
// Każda zmiana od razu trafia na ekran, a potem: gość → pamięć przeglądarki, zalogowany → konto na serwerze.

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Database, DayEntry, DbChanges, Mode, User } from '../types'
import * as api from './api'
import { applyChanges } from './changes'
import { clearGuest, loadGuest, resetGuest, writeGuest } from './localDb'

type Store = {
  db: Database
  mode: Mode
  user: User | null // null = gość
  guestName: string
  dayOf: (date: string) => DayEntry
  save: (changes: DbChanges) => void
  updateDay: (date: string, day: DayEntry) => void
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

type State = { db: Database; user: User | null; guestName: string }

const EMPTY_DAY: DayEntry = { vegetables: [], fruits: [] }

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State | null>(null)
  const current = useRef<State | null>(null)
  current.current = state

  useEffect(() => {
    ;(async () => {
      const session = await api.loadSession()
      if (session) return setState({ db: session.db, user: session.user, guestName: session.user.guestName })
      const guest = loadGuest()
      setState({ db: guest.db, user: null, guestName: guest.guestName })
    })()
  }, [])

  if (!state) return <p className="p-8 text-center text-stone-400">Ładowanie…</p>

  const save = (changes: DbChanges) => {
    const { db, user, guestName } = current.current!
    const next = applyChanges(db, changes)
    current.current = { ...current.current!, db: next }
    setState(current.current)
    if (user) api.queueServerChanges(changes)
    else writeGuest({ guestName, db: next })
  }

  /** Po rejestracji/logowaniu dane są już na koncie — pamięć gościa czyścimy. */
  const signIn = ({ user, db }: { user: User; db: Database }) => {
    clearGuest()
    setState({ db, user, guestName: user.guestName })
  }

  const store: Store = {
    ...state,
    mode: state.db.settings.mode ?? 'basic',
    dayOf: (date) => state.db.days[date] ?? EMPTY_DAY,
    save,
    updateDay: (date, day) => save({ days: { [date]: day } }),
    register: async (email, password) => signIn(await api.register(email, password, state.guestName, state.db)),
    login: async (email, password) => signIn(await api.login(email, password, state.db)),
    logout: async () => {
      await api.logout()
      const guest = resetGuest(state.db.settings.mode)
      setState({ db: guest.db, user: null, guestName: guest.guestName })
    },
    resetPassword: async (token, password) => signIn(await api.resetPassword(token, password)),
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)!
