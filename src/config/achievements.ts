// SERIE I ODZNAKI — kiedy dzień się „zalicza” do serii i za co są odznaki. Tu dodasz nową odznakę.

import type { Days, Mode } from '../types'
import { shiftKey } from '../lib/date'
import { COLOR_ORDER, dayColors } from './balance'
import { GROUP_ORDER, PRODUCE } from './produce'
import { calculateScore } from './scoring'

export const STREAK = {
  minScore: 60, // dzień zalicza się do serii od 60 pkt
}

/** Ile dni z rzędu (do dziś lub do wczoraj, jeśli dziś jeszcze nie ma wyniku) ma co najmniej `minScore`. */
export function streakLength(days: Days, today: string, mode: Mode, minScore = STREAK.minScore): number {
  const ok = (key: string) => !!days[key] && calculateScore(days[key], mode) >= minScore
  let key = ok(today) ? today : shiftKey(today, -1)
  let count = 0
  while (ok(key)) {
    count++
    key = shiftKey(key, -1)
  }
  return count
}

/** Najdłuższa seria w całej historii. */
function bestStreak(days: Days, mode: Mode, minScore: number): number {
  const ok = (key: string) => !!days[key] && calculateScore(days[key], mode) >= minScore
  return Math.max(0, ...Object.keys(days).filter((key) => ok(key) && !ok(shiftKey(key, -1))).map((start) => {
    let n = 0
    while (ok(shiftKey(start, n))) n++
    return n
  }))
}

const allNames = (days: Days) => new Set(Object.values(days).flatMap((day) => GROUP_ORDER.flatMap((g) => day[g].map((i) => i.name))))
const builtInCount = GROUP_ORDER.reduce((n, g) => n + PRODUCE[g].length, 0)

type Badge = { icon: string; name: string; description: string; earned: (days: Days, mode: Mode) => boolean }

export const BADGES: Badge[] = [
  { icon: '🌱', name: 'Pierwszy krok', description: 'Pierwszy zapisany dzień', earned: (days) => Object.keys(days).length > 0 },
  { icon: '💯', name: 'Setka', description: 'Pierwszy dzień ze 100 pkt', earned: (days, mode) => Object.values(days).some((d) => calculateScore(d, mode) === 100) },
  { icon: '🌈', name: 'Tęcza', description: 'Wszystkie 5 kolorów jednego dnia', earned: (days) => Object.values(days).some((d) => dayColors(d).size === COLOR_ORDER.length) },
  { icon: '🔥', name: '3 dni z rzędu', description: `Seria 3 dni od ${STREAK.minScore} pkt`, earned: (days, mode) => bestStreak(days, mode, STREAK.minScore) >= 3 },
  { icon: '⚡', name: 'Tydzień mocy', description: `Seria 7 dni od ${STREAK.minScore} pkt`, earned: (days, mode) => bestStreak(days, mode, STREAK.minScore) >= 7 },
  { icon: '🏆', name: 'Miesiąc nawyku', description: `Seria 30 dni od ${STREAK.minScore} pkt`, earned: (days, mode) => bestStreak(days, mode, STREAK.minScore) >= 30 },
  { icon: '👑', name: 'Perfekcyjny tydzień', description: '7 dni z rzędu od 90 pkt', earned: (days, mode) => bestStreak(days, mode, 90) >= 7 },
  { icon: '🧭', name: 'Odkrywca', description: '20 różnych warzyw i owoców', earned: (days) => allNames(days).size >= 20 },
  { icon: '🎒', name: 'Kolekcjoner', description: `Wszystkie ${builtInCount} produkty z listy`, earned: (days) => GROUP_ORDER.every((g) => PRODUCE[g].every((p) => allNames(days).has(p.name))) },
]
