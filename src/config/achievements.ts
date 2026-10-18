// SERIE I ODZNAKI — kiedy dzień się „zalicza” do serii i za co są odznaki. Tu dodasz nową odznakę.
// Każda odznaka zwraca listę dat zdobycia: jednorazowe mają najwyżej jedną datę, wielokrotne (repeatable) dowolnie wiele.
// Na ekranie: licznik ×N i kolejność od ostatnio zdobytej.

import type { Days, Mode } from '../types'
import { shiftKey, weekStart } from '../lib/date'
import { COLOR_ORDER, dayColors } from './balance'
import { GROUP_ORDER, hasTag, PRODUCE } from './produce'
import { calculateScore } from './scoring'

export const STREAK = {
  minScore: 60, // dzień zalicza się do serii od 60 pkt
}

export const FERMENTED = {
  daysPerWeek: 3, // odznaka „Moc kiszonek”: kiszonka w tyle różnych dni jednego tygodnia (pon–nd)
}

const scoreOk = (days: Days, mode: Mode, minScore: number) => (key: string) => !!days[key] && calculateScore(days[key], mode) >= minScore

/** Ile dni z rzędu (do dziś lub do wczoraj, jeśli dziś jeszcze nie ma wyniku) ma co najmniej `minScore`. */
export function streakLength(days: Days, today: string, mode: Mode, minScore = STREAK.minScore): number {
  const ok = scoreOk(days, mode, minScore)
  let key = ok(today) ? today : shiftKey(today, -1)
  let count = 0
  while (ok(key)) {
    count++
    key = shiftKey(key, -1)
  }
  return count
}

const sortedKeys = (days: Days) => Object.keys(days).sort()

/** Daty, w których seria osiągnęła `length` dni (każda seria liczy się raz). */
function streakReached(days: Days, mode: Mode, length: number, minScore: number): string[] {
  const ok = scoreOk(days, mode, minScore)
  return sortedKeys(days).filter((key) => {
    for (let i = 0; i < length; i++) if (!ok(shiftKey(key, -i))) return false
    return !ok(shiftKey(key, -length)) // dokładnie `length`-ty dzień serii
  })
}

/** Pierwszy dzień, w którym zebrane do tej pory produkty spełniły warunek `done` (np. 20 różnych). */
function collectedOn(days: Days, done: (names: Set<string>) => boolean): string[] {
  const names = new Set<string>()
  for (const key of sortedKeys(days)) {
    GROUP_ORDER.forEach((g) => days[key][g].forEach((item) => names.add(item.name)))
    if (done(names)) return [key]
  }
  return []
}

/** Daty, w których w danym tygodniu był `daysPerWeek`-ty dzień z kiszonką (raz na tydzień). */
function fermentedWeeks(days: Days): string[] {
  const perWeek = new Map<string, number>()
  return sortedKeys(days).filter((key) => {
    if (!GROUP_ORDER.some((g) => days[key][g].some((item) => hasTag(item.name, 'kiszonka')))) return false
    const n = (perWeek.get(weekStart(key)) ?? 0) + 1
    perWeek.set(weekStart(key), n)
    return n === FERMENTED.daysPerWeek
  })
}

const allBuiltIn = GROUP_ORDER.flatMap((g) => PRODUCE[g].map((p) => p.name))

type Badge = { icon: string; name: string; description: string; repeatable: boolean; dates: (days: Days, mode: Mode) => string[] }

export const BADGES: Badge[] = [
  { icon: '🌱', name: 'Pierwszy krok', description: 'Pierwszy zapisany dzień', repeatable: false, dates: (days) => sortedKeys(days).slice(0, 1) },
  { icon: '💯', name: 'Setka', description: 'Dzień ze 100 pkt', repeatable: true, dates: (days, mode) => sortedKeys(days).filter((k) => calculateScore(days[k], mode) === 100) },
  { icon: '🌈', name: 'Tęcza', description: 'Wszystkie 5 kolorów jednego dnia', repeatable: true, dates: (days) => sortedKeys(days).filter((k) => dayColors(days[k]).size === COLOR_ORDER.length) },
  { icon: '🔥', name: '3 dni z rzędu', description: `Seria 3 dni od ${STREAK.minScore} pkt`, repeatable: true, dates: (days, mode) => streakReached(days, mode, 3, STREAK.minScore) },
  { icon: '⚡', name: 'Tydzień mocy', description: `Seria 7 dni od ${STREAK.minScore} pkt`, repeatable: true, dates: (days, mode) => streakReached(days, mode, 7, STREAK.minScore) },
  { icon: '🏆', name: 'Miesiąc nawyku', description: `Seria 30 dni od ${STREAK.minScore} pkt`, repeatable: true, dates: (days, mode) => streakReached(days, mode, 30, STREAK.minScore) },
  { icon: '👑', name: 'Perfekcyjny tydzień', description: '7 dni z rzędu od 90 pkt', repeatable: true, dates: (days, mode) => streakReached(days, mode, 7, 90) },
  { icon: '🥒', name: 'Moc kiszonek', description: `Kiszonki w ${FERMENTED.daysPerWeek} dni jednego tygodnia`, repeatable: true, dates: fermentedWeeks },
  { icon: '🧭', name: 'Odkrywca', description: '20 różnych warzyw i owoców', repeatable: false, dates: (days) => collectedOn(days, (names) => names.size >= 20) },
  { icon: '🎒', name: 'Kolekcjoner', description: `Wszystkie ${allBuiltIn.length} produkty z listy`, repeatable: false, dates: (days) => collectedOn(days, (names) => allBuiltIn.every((n) => names.has(n))) },
]

export type BadgeStatus = Badge & { count: number; last: string | null }

/** Odznaki z licznikiem i datą ostatniego zdobycia; najpierw zdobyte (od najnowszej), potem pozostałe. */
export function badgeStatus(days: Days, mode: Mode): BadgeStatus[] {
  return BADGES.map((badge) => {
    const dates = badge.dates(days, mode)
    return { ...badge, count: dates.length, last: dates.at(-1) ?? null }
  }).sort((a, b) => (b.last ?? '').localeCompare(a.last ?? ''))
}
