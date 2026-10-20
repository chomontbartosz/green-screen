// Pomocnicze funkcje dat. Klucz dnia ma format RRRR-MM-DD (czas lokalny).

const pad = (n: number) => String(n).padStart(2, '0')

export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromKey = (key: string) => new Date(`${key}T00:00:00`)

/** Klucz dnia przesunięty o `delta` dni, np. shiftKey('2026-10-16', -1) → '2026-10-15' */
export function shiftKey(key: string, delta: number) {
  const d = fromKey(key)
  return toKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + delta))
}

/** Ile dni dzieli dwie daty (b − a). */
export const daysBetween = (a: string, b: string) => Math.round((fromKey(b).getTime() - fromKey(a).getTime()) / 86_400_000)

/** Poniedziałek tygodnia, do którego należy dzień. */
export const weekStart = (key: string) => shiftKey(key, -((fromKey(key).getDay() + 6) % 7))

/** `count` kolejnych dni wstecz, licząc od `end` włącznie (najnowszy pierwszy). */
export const pastKeys = (end: string, count: number) => Array.from({ length: count }, (_, i) => shiftKey(end, -i))

export const formatLong = (key: string) =>
  fromKey(key).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** Skróty miesięcy (sty, lut…) i forma „w …” (w styczniu, w lutym…). Indeks 0 = styczeń. */
export const MONTH_SHORT = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru']
export const MONTH_IN = ['styczniu', 'lutym', 'marcu', 'kwietniu', 'maju', 'czerwcu', 'lipcu', 'sierpniu', 'wrześniu', 'październiku', 'listopadzie', 'grudniu']

export const formatMonth = (d: Date) => d.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })
