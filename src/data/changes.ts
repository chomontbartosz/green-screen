// Zasady danych wspólne dla serwera (MySQL) i aplikacji (ekran, pamięć przeglądarki):
// pusta baza, nanoszenie zmian na bazę i łączenie kilku zmian w jedną (do wysyłki na serwer).

import type { Database, DayEntry, DbChanges } from '../types'

/** Baza nowego użytkownika */
export const EMPTY_DB: Database = { settings: { mode: null, demoOffered: false, hiddenCustom: [] }, days: {} }

export const isEmptyDay = (day: DayEntry) => Object.values(day).every((items) => items.length === 0)

export function applyChanges(db: Database, changes: DbChanges): Database {
  const days = { ...db.days, ...changes.days }
  for (const [date, day] of Object.entries(changes.days ?? {})) {
    if (isEmptyDay(day)) delete days[date] // pusty dzień nie zaśmieca bazy
  }
  return { settings: { ...db.settings, ...changes.settings }, days }
}

/** Uzupełnia brakujące pola (np. dane zapisane przez starszą wersję aplikacji). */
export const normalizeDb = (db: Partial<Database> | null | undefined): Database => applyChanges(EMPTY_DB, { settings: db?.settings, days: db?.days })

/** Łączy dwie zmiany w jedną — późniejsza wygrywa. */
export const mergeChanges = (a: DbChanges | null, b: DbChanges): DbChanges => ({
  settings: { ...a?.settings, ...b.settings },
  days: { ...a?.days, ...b.days },
})
