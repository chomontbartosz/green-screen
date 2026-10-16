// ODKRYJ COŚ NOWEGO i SEZONOWOŚĆ — co polecić na ekranie „Dziś”. Sezony produktów są w config/produce.ts.

import type { Days, Group } from '../types'
import { fromKey, pastKeys } from '../lib/date'
import { GROUP_ORDER, PRODUCE, type Produce } from './produce'

export const DISCOVER = {
  lookbackDays: 30, // polecamy produkt, który w tym okresie był najrzadziej
}

const MONTHS = ['styczniu', 'lutym', 'marcu', 'kwietniu', 'maju', 'czerwcu', 'lipcu', 'sierpniu', 'wrześniu', 'październiku', 'listopadzie', 'grudniu']

export const monthName = (today: string) => MONTHS[fromKey(today).getMonth()]

/** Produkty w sezonie w Polsce w miesiącu dzisiejszej daty. */
export function inSeason(today: string): { group: Group; produce: Produce }[] {
  const month = fromKey(today).getMonth() + 1
  return GROUP_ORDER.flatMap((group) => PRODUCE[group].filter((p) => p.season.includes(month)).map((produce) => ({ group, produce })))
}

/**
 * Jeden produkt dnia: ten, który w ostatnich 30 dniach był najrzadziej (najlepiej wcale), sezonowe mają pierwszeństwo.
 * Wybór zależy od daty, więc przez cały dzień polecamy to samo.
 */
export function discoverPick(days: Days, today: string): { group: Group; produce: Produce } | null {
  const eaten = pastKeys(today, DISCOVER.lookbackDays).flatMap((key) => GROUP_ORDER.flatMap((g) => (days[key]?.[g] ?? []).map((i) => i.name)))
  const count = (name: string) => eaten.filter((n) => n === name).length
  const month = fromKey(today).getMonth() + 1
  const all = GROUP_ORDER.flatMap((group) => PRODUCE[group].map((produce) => ({ group, produce })))
  const seasonal = all.filter(({ produce }) => produce.season.includes(month))
  const candidates = seasonal.length ? seasonal : all
  const fewest = Math.min(...candidates.map(({ produce }) => count(produce.name)))
  const pool = candidates.filter(({ produce }) => count(produce.name) === fewest)
  if (pool.length === 0) return null
  const seed = [...today].reduce((sum, ch) => sum + ch.charCodeAt(0) * 31, 0)
  return pool[seed % pool.length]
}
