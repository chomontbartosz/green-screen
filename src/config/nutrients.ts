// WITAMINY, MINERAŁY I BŁONNIK — nazwy, skala 1–5 w dymku produktu i wykresy pierścieniowe w „Podsumowaniu”.
// Zawartość składników w każdym produkcie (skala 1–5) jest w config/produce.ts.
//
// Skala 1–5 jest orientacyjna: ile składnika jest w porcji ok. 100 g względem dziennego zapotrzebowania
// (1 = śladowo, <5% · 2 = 5–10% · 3 = 10–20% · 4 = 20–40% · 5 = ponad 40%).
//
// Dlaczego wykresy liczą 7 dni, a nie 1 dzień: normy dzienne to średnie (EFSA, źródło niżej).
// Witaminy A, D, E i K organizm magazynuje, a C i z grupy B trzeba uzupełniać regularnie, więc
// nie każdy składnik musi być każdego dnia. 7 dni to założenie aplikacji: dość długo, żeby pojedynczy
// dzień nie psuł obrazu, i dość krótko, żeby braki szybko było widać.

import type { Days, Mode } from '../types'
import { pastKeys } from '../lib/date'
import { GROUP_ORDER, PRODUCE } from './produce'
import { portions, SCORING } from './scoring'

export type Chart = 'vitamins' | 'minerals'

export const CHARTS: Record<Chart, string> = {
  vitamins: 'Witaminy',
  minerals: 'Minerały i błonnik',
}

export const NUTRIENTS = {
  witA: { name: 'Witamina A', short: 'A', chart: 'vitamins', role: 'wzrok i skóra' },
  witB: { name: 'Witaminy z gr. B', short: 'B', chart: 'vitamins', role: 'energia i układ nerwowy' },
  foliany: { name: 'Foliany (B9)', short: 'B9', chart: 'vitamins', role: 'krew i podział komórek' },
  witC: { name: 'Witamina C', short: 'C', chart: 'vitamins', role: 'odporność i wchłanianie żelaza' },
  witD: { name: 'Witamina D', short: 'D', chart: 'vitamins', role: 'kości i odporność', note: 'Z roślin daje ją tylko część grzybów — główne źródła to słońce i ryby.' },
  witE: { name: 'Witamina E', short: 'E', chart: 'vitamins', role: 'ochrona komórek' },
  witK: { name: 'Witamina K', short: 'K', chart: 'vitamins', role: 'krzepnięcie krwi i kości' },
  potas: { name: 'Potas', short: 'K⁺', chart: 'minerals', role: 'ciśnienie krwi i mięśnie' },
  magnez: { name: 'Magnez', short: 'Mg', chart: 'minerals', role: 'mięśnie i sen' },
  wapn: { name: 'Wapń', short: 'Ca', chart: 'minerals', role: 'kości i zęby', note: 'Najwięcej wapnia dają nabiał i napoje roślinne wzbogacane — warzywa to dodatek.' },
  zelazo: { name: 'Żelazo', short: 'Fe', chart: 'minerals', role: 'transport tlenu', note: 'Żelazo z roślin lepiej się wchłania z witaminą C (np. papryka, cytryna).' },
  mangan: { name: 'Mangan', short: 'Mn', chart: 'minerals', role: 'kości i metabolizm' },
  blonnik: { name: 'Błonnik', short: 'Bł', chart: 'minerals', role: 'trawienie i sytość' },
} satisfies Record<string, { name: string; short: string; chart: Chart; role: string; note?: string }>

export type Nutrient = keyof typeof NUTRIENTS
export type Level = 1 | 2 | 3 | 4 | 5

/** Kolory skali 1–5: jeden odcień od jasnego do ciemnego. */
export const LEVELS: Record<Level, { label: string; color: string }> = {
  1: { label: 'śladowo', color: 'bg-stone-300' },
  2: { label: 'trochę', color: 'bg-green-200' },
  3: { label: 'średnio', color: 'bg-brand' },
  4: { label: 'dużo', color: 'bg-brand-strong' },
  5: { label: 'bardzo dużo', color: 'bg-brand-ink' },
}

export const NUTRITION = {
  windowDays: 7, // okres, z którego liczymy wykresy (patrz komentarz na górze)
  rings: 5, // maks. liczba pierścieni na wycinek
  source: { title: 'EFSA — Dietary Reference Values (normy żywieniowe UE)', url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values' },
}

export type Coverage = { nutrient: Nutrient; rings: number; bestSources: string[] }

/**
 * Ile pierścieni (0–5) dostaje każdy składnik w ostatnich 7 dniach (licząc z dzisiaj).
 * Punkt odniesienia = tydzień 5 + 5 z równą mieszanką wszystkich produktów z listy:
 *   pierścienie = 5 × (Twoja suma „poziom × porcje”) / (średni poziom produktu × 10 porcji × 7 dni).
 * Wynik jest celowo przybliżony — ma pokazać kierunek, a nie dokładne miligramy.
 */
export function nutrientCoverage(days: Days, today: string, mode: Mode): Coverage[] {
  const all = GROUP_ORDER.flatMap((g) => PRODUCE[g])
  const eaten = pastKeys(today, NUTRITION.windowDays).flatMap((key) =>
    GROUP_ORDER.flatMap((g) => (days[key]?.[g] ?? []).map((item) => ({ item, produce: PRODUCE[g].find((p) => p.name === item.name) }))),
  )
  const goalPortions = (SCORING.goal.vegetables + SCORING.goal.fruits) * NUTRITION.windowDays

  return (Object.keys(NUTRIENTS) as Nutrient[]).map((nutrient) => {
    const level = (p?: (typeof all)[number]) => p?.nutrients[nutrient] ?? 0
    const baseline = (all.reduce((sum, p) => sum + level(p), 0) / all.length) * goalPortions
    const yours = eaten.reduce((sum, e) => sum + level(e.produce) * portions([e.item], mode), 0)
    return {
      nutrient,
      rings: Math.min(NUTRITION.rings, Math.round((NUTRITION.rings * yours) / baseline)),
      bestSources: all.filter((p) => level(p) >= 2).sort((a, b) => level(b) - level(a)).slice(0, 4).map((p) => p.name),
    }
  })
}
