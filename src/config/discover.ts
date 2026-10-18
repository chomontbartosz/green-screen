// ODKRYJ COŚ NOWEGO (ekran „Dziś”) i SEZONOWOŚĆ (kalendarz) — co polecić. Sezony produktów są w config/produce.ts.

import type { Days, Group } from '../types'
import { fromKey, pastKeys } from '../lib/date'
import { GROUP_ORDER, PRODUCE, type Produce } from './produce'

export const DISCOVER = {
  lookbackDays: 30, // polecamy produkty, które w tym okresie były najrzadziej
  picks: 3, // ile propozycji w karuzeli
}

const MONTHS = ['styczniu', 'lutym', 'marcu', 'kwietniu', 'maju', 'czerwcu', 'lipcu', 'sierpniu', 'wrześniu', 'październiku', 'listopadzie', 'grudniu']

/** „w październiku” — do nagłówka sezonu. */
export const monthName = (month: Date) => MONTHS[month.getMonth()]

/** Produkty w sezonie w Polsce w danym miesiącu. */
export function inSeason(month: Date): { group: Group; produce: Produce }[] {
  const m = month.getMonth() + 1
  return GROUP_ORDER.flatMap((group) => PRODUCE[group].filter((p) => p.season.includes(m)).map((produce) => ({ group, produce })))
}

/**
 * Propozycje dnia: produkty, które w ostatnich 30 dniach były najrzadziej (najlepiej wcale); sezonowe mają pierwszeństwo.
 * Kolejność przy remisie zależy od daty, więc przez cały dzień polecamy to samo.
 */
export function discoverPicks(days: Days, today: string): { group: Group; produce: Produce }[] {
  const eaten = pastKeys(today, DISCOVER.lookbackDays).flatMap((key) => GROUP_ORDER.flatMap((g) => (days[key]?.[g] ?? []).map((i) => i.name)))
  const count = (name: string) => eaten.filter((n) => n === name).length
  const month = fromKey(today).getMonth() + 1
  const seed = (name: string) => [...(today + name)].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 9973, 7)
  const rank = (p: Produce) => [p.season.includes(month) ? 0 : 1, count(p.name), seed(p.name)]

  return GROUP_ORDER.flatMap((group) => PRODUCE[group].map((produce) => ({ group, produce })))
    .sort((a, b) => {
      const [x, y] = [rank(a.produce), rank(b.produce)]
      return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
    })
    .slice(0, DISCOVER.picks)
}
