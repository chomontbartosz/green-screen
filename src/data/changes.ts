// Zasada nanoszenia zmian na bazę — wspólna dla serwera (zapis do pliku) i aplikacji (podgląd na ekranie).

import type { Database, DayEntry, DbChanges } from '../types'

export const isEmptyDay = (day: DayEntry) => Object.values(day).every((items) => items.length === 0)

export function applyChanges(db: Database, changes: DbChanges): Database {
  const days = { ...db.days, ...changes.days }
  for (const [date, day] of Object.entries(changes.days ?? {})) {
    if (isEmptyDay(day)) delete days[date] // pusty dzień nie zaśmieca bazy
  }
  return { settings: { ...db.settings, ...changes.settings }, days }
}
