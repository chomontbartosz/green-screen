// Stan aplikacji dostępny na każdym ekranie przez useStore().
// Każda zmiana od razu trafia na ekran i do bazy (autozapis, bez przycisku „Zapisz”).

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Database, DayEntry, DbChanges, Mode } from '../types'
import { loadDb, saveChanges } from './api'
import { applyChanges } from './changes'

type Store = {
  db: Database
  mode: Mode
  dayOf: (date: string) => DayEntry
  save: (changes: DbChanges) => void
  updateDay: (date: string, day: DayEntry) => void
}

const EMPTY_DAY: DayEntry = { vegetables: [], fruits: [] }

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null)

  useEffect(() => {
    loadDb().then(setDb)
  }, [])

  if (!db) return <p className="p-8 text-center text-stone-400">Ładowanie…</p>

  const save = (changes: DbChanges) => {
    setDb((prev) => prev && applyChanges(prev, changes))
    saveChanges(changes)
  }

  const store: Store = {
    db,
    mode: db.settings.mode ?? 'basic',
    dayOf: (date) => db.days[date] ?? EMPTY_DAY,
    save,
    updateDay: (date, day) => save({ days: { [date]: day } }),
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)!
