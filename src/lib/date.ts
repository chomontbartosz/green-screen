// Pomocnicze funkcje dat. Klucz dnia ma format RRRR-MM-DD (czas lokalny).

const pad = (n: number) => String(n).padStart(2, '0')

export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromKey = (key: string) => new Date(`${key}T00:00:00`)

/** Klucz dnia przesunięty o `delta` dni, np. shiftKey('2026-10-16', -1) → '2026-10-15' */
export function shiftKey(key: string, delta: number) {
  const d = fromKey(key)
  return toKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta))
}

/** Poniedziałek tygodnia, do którego należy dzień. */
export const weekStart = (key: string) => shiftKey(key, -((fromKey(key).getDay() + 6) % 7))

/** `count` kolejnych dni wstecz, licząc od `end` włącznie (najnowszy pierwszy). */
export const pastKeys = (end: string, count: number) => Array.from({ length: count }, (_, i) => shiftKey(end, -i))

export const formatLong = (key: string) =>
  fromKey(key).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const formatMonth = (d: Date) => d.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })
