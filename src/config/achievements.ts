// SERIE I ODZNAKI — kiedy dzień się „zalicza” do serii i za co są odznaki. Tu dodasz nową odznakę albo zmienisz progi.
// Każda odznaka zwraca listę dat zdobycia: jednorazowe mają najwyżej jedną datę, wielokrotne (repeatable) dowolnie wiele.
// Odznaki z poziomami (np. Odkrywca 10 / 20 / 40 / 60) to osobne odznaki — każdy poziom zdobywa się oddzielnie.
// Na ekranie: licznik ×N, poziom i kolejność od ostatnio zdobytej.

import type { DayEntry, Days, Mode } from '../types'
import { daysBetween, shiftKey, weekStart } from '../lib/date'
import { COLOR_ORDER, dayColors } from './balance'
import { ALL_PRODUCE, hasTag, itemsOfDay } from './produce'
import { calculateScore, portions } from './scoring'

export const STREAK = {
  minEntries: 1, // dzień liczy się do serii, gdy ma co najmniej tyle wpisów (seria = nawyk zapisywania)
}

/** Progi odznak z poziomami — każdy próg to osobna odznaka. */
export const TIERS = {
  streak: [3, 7, 30, 100, 365], // dni z rzędu z wpisem
  explorer: [10, 20, 40, 60], // różne warzywa i owoce łącznie
  hundred: [10, 50, 100], // dni ze 100 pkt łącznie
  traveler: [5, 10], // różne owoce egzotyczne (znacznik 'egzotyczne' w produce.ts)
  purple: [10, 25, 50], // porcje fioletowych/niebieskich/czarnych w jednym miesiącu
  greens: [10, 30], // dni z rzędu z warzywami liściastymi (znacznik 'liściaste')
  precision: [7, 30, 100], // dni z wpisanymi gramami (tryb eksperta)
}

export const RULES = {
  perfectScore: 90, // „Perfekcyjny tydzień”: 7 dni z rzędu od tylu punktów
  fermentedDaysPerWeek: 3, // „Moc kiszonek”: kiszonka w tyle dni jednego tygodnia (pon–nd)
  legumeDaysPerWeek: 3, // „Strączkowy tydzień”
  seasonalPerSeason: 10, // „Sezonowiec”: tyle różnych produktów w sezonie w trakcie jednej pory roku
  returnAfterDays: 3, // „Powrót”: wpis po co najmniej tylu dniach przerwy
  polishSummer: ['Truskawki', 'Czereśnie', 'Maliny', 'Borówki', ['Porzeczki czarne', 'Porzeczki czerwone']] as (string | string[])[],
}

const SEASONS = [
  { icon: '🌸', name: 'Wiosna', months: [3, 4, 5] },
  { icon: '☀️', name: 'Lato', months: [6, 7, 8] },
  { icon: '🍂', name: 'Jesień', months: [9, 10, 11] },
  { icon: '❄️', name: 'Zima', months: [12, 1, 2] },
]

// --- pomocnicze -------------------------------------------------------------

const keysOf = (days: Days) => Object.keys(days).sort()
const monthOf = (key: string) => Number(key.slice(5, 7))
const namesOf = (day: DayEntry) => itemsOfDay(day).map(({ item }) => item.name)
const dayHas = (day: DayEntry, test: (name: string) => boolean) => namesOf(day).some(test)
const exotic = ALL_PRODUCE.filter(({ produce }) => produce.tags?.includes('egzotyczne')).map(({ produce }) => produce.name)
const allBuiltIn = ALL_PRODUCE.map(({ produce }) => produce.name)

const entries = (day?: DayEntry) => itemsOfDay(day).length

/** Ile dni z rzędu (do dziś lub do wczoraj, jeśli dziś jeszcze nic nie ma) ma wpis. */
export function streakLength(days: Days, today: string): number {
  const ok = (key: string) => entries(days[key]) >= STREAK.minEntries
  let key = ok(today) ? today : shiftKey(today, -1)
  let count = 0
  while (ok(key)) {
    count++
    key = shiftKey(key, -1)
  }
  return count
}

/** Daty, w których seria dni spełniających `ok` osiągnęła `length` (każda seria liczy się raz). */
function runs(days: Days, ok: (key: string) => boolean, length: number): string[] {
  return keysOf(days).filter((key) => {
    for (let i = 0; i < length; i++) if (!ok(shiftKey(key, -i))) return false
    return !ok(shiftKey(key, -length)) // dokładnie `length`-ty dzień serii
  })
}

/** Pierwszy dzień, w którym suma narastająco osiągnęła próg. */
function cumulative(days: Days, valueOf: (key: string) => number, threshold: number): string[] {
  let total = 0
  for (const key of keysOf(days)) if ((total += valueOf(key)) >= threshold) return [key]
  return []
}

/** Pierwszy dzień, w którym zebrane do tej pory produkty spełniły warunek `done`. */
function collected(days: Days, done: (names: Set<string>) => boolean): string[] {
  const names = new Set<string>()
  for (const key of keysOf(days)) {
    namesOf(days[key]).forEach((name) => names.add(name))
    if (done(names)) return [key]
  }
  return []
}

/** W każdym okresie (tydzień, miesiąc, pora roku): dzień, w którym suma w tym okresie osiągnęła próg. */
function perPeriod(days: Days, periodOf: (key: string) => string | null, valueOf: (key: string) => number, threshold: number): string[] {
  const totals = new Map<string, number>()
  return keysOf(days).filter((key) => {
    const period = periodOf(key)
    if (!period) return false
    const before = totals.get(period) ?? 0
    totals.set(period, before + valueOf(key))
    return before < threshold && before + valueOf(key) >= threshold
  })
}

/** W każdym okresie: dzień, w którym zebrane w tym okresie nazwy spełniły warunek `done`. */
function perPeriodCollected(days: Days, periodOf: (key: string) => string | null, pick: (key: string) => string[], done: (names: Set<string>) => boolean) {
  const sets = new Map<string, Set<string>>()
  return keysOf(days).filter((key) => {
    const period = periodOf(key)
    if (!period) return false
    const set = sets.get(period) ?? new Set<string>()
    const wasDone = done(set)
    pick(key).forEach((name) => set.add(name))
    sets.set(period, set)
    return !wasDone && done(set)
  })
}

/** Pora roku z rokiem, np. „2026-Zima” (grudzień liczy się do zimy następnego roku). */
const seasonOf = (key: string, season: (typeof SEASONS)[number]) =>
  season.months.includes(monthOf(key)) ? `${Number(key.slice(0, 4)) + (monthOf(key) === 12 ? 1 : 0)}-${season.name}` : null

const seasonalEaten = (day: DayEntry, month: number) =>
  itemsOfDay(day).filter(({ produce }) => produce?.season.includes(month)).map(({ item }) => item.name)

const purplePortions = (day: DayEntry, mode: Mode) =>
  itemsOfDay(day).reduce((sum, { item, produce }) => sum + (produce?.color === 'purple' ? portions([item], mode) : 0), 0)

// --- odznaki ----------------------------------------------------------------

type Badge = { icon: string; name: string; description: string; repeatable: boolean; level?: number; dates: (days: Days, mode: Mode) => string[] }

const STREAK_NAMES = ['3 dni z rzędu', 'Tydzień nawyku', 'Miesiąc nawyku', '100 dni', 'Rok nawyku']
const STREAK_ICONS = ['🔥', '⚡', '🏆', '💪', '🎖️']

export const BADGES: Badge[] = [
  { icon: '🌱', name: 'Pierwszy krok', description: 'Pierwszy zapisany dzień', repeatable: false, dates: (days) => keysOf(days).slice(0, 1) },

  // wynik dnia
  { icon: '💯', name: 'Setka', description: 'Dzień ze 100 pkt', repeatable: true, dates: (days, mode) => keysOf(days).filter((k) => calculateScore(days[k], mode) === 100) },
  ...TIERS.hundred.map((n, i) => ({
    icon: '💯', name: `Setka ×${n}`, description: `${n} dni ze 100 pkt`, repeatable: false, level: i + 1,
    dates: (days: Days, mode: Mode) => cumulative(days, (k) => (calculateScore(days[k], mode) === 100 ? 1 : 0), n),
  })),
  { icon: '👑', name: 'Perfekcyjny tydzień', description: `7 dni z rzędu od ${RULES.perfectScore} pkt`, repeatable: true,
    dates: (days, mode) => runs(days, (k) => !!days[k] && calculateScore(days[k], mode) >= RULES.perfectScore, 7) },

  // serie
  ...TIERS.streak.map((n, i) => ({
    icon: STREAK_ICONS[i] ?? '🔥', name: STREAK_NAMES[i] ?? `${n} dni z rzędu`, description: `${n} dni z rzędu z wpisem`, repeatable: true, level: i + 1,
    dates: (days: Days) => runs(days, (k) => entries(days[k]) >= STREAK.minEntries, n),
  })),
  { icon: '🔄', name: 'Powrót', description: `Wpis po co najmniej ${RULES.returnAfterDays} dniach przerwy`, repeatable: true,
    dates: (days) => keysOf(days).filter((k, i, keys) => i > 0 && daysBetween(keys[i - 1], k) > RULES.returnAfterDays) },

  // kolory
  { icon: '🌈', name: 'Tęcza', description: 'Wszystkie 5 kolorów jednego dnia', repeatable: true, dates: (days) => keysOf(days).filter((k) => dayColors(days[k]).size === COLOR_ORDER.length) },
  { icon: '🌈', name: 'Tęczowy tydzień', description: '5 kolorów każdego dnia przez 7 dni', repeatable: true,
    dates: (days) => runs(days, (k) => !!days[k] && dayColors(days[k]).size === COLOR_ORDER.length, 7) },
  ...TIERS.purple.map((n, i) => ({
    icon: '🟣', name: `Fioletowa moc ${n}`, description: `${n} porcji fioletowych w jednym miesiącu`, repeatable: true, level: i + 1,
    dates: (days: Days, mode: Mode) => perPeriod(days, (k) => k.slice(0, 7), (k) => purplePortions(days[k], mode), n),
  })),
  ...TIERS.greens.map((n, i) => ({
    icon: '🥬', name: `Zielona ${n === 10 ? 'dziesiątka' : 'trzydziestka'}`, description: `Liściaste warzywa ${n} dni z rzędu`, repeatable: true, level: i + 1,
    dates: (days: Days) => runs(days, (k) => !!days[k] && dayHas(days[k], (name) => hasTag(name, 'liściaste')), n),
  })),

  // tygodniowe nawyki
  { icon: '🥒', name: 'Moc kiszonek', description: `Kiszonki w ${RULES.fermentedDaysPerWeek} dni jednego tygodnia`, repeatable: true,
    dates: (days) => perPeriod(days, weekStart, (k) => (dayHas(days[k], (name) => hasTag(name, 'kiszonka')) ? 1 : 0), RULES.fermentedDaysPerWeek) },
  { icon: '🫘', name: 'Strączkowy tydzień', description: `Strączki w ${RULES.legumeDaysPerWeek} dni jednego tygodnia`, repeatable: true,
    dates: (days) => perPeriod(days, weekStart, (k) => (dayHas(days[k], (name) => hasTag(name, 'strączki')) ? 1 : 0), RULES.legumeDaysPerWeek) },

  // sezony
  ...SEASONS.map((season) => ({
    icon: season.icon, name: `Sezonowiec: ${season.name.toLowerCase()}`, description: `${RULES.seasonalPerSeason} różnych produktów w sezonie w trakcie pory roku`, repeatable: true,
    dates: (days: Days) => perPeriodCollected(days, (k) => seasonOf(k, season), (k) => seasonalEaten(days[k], monthOf(k)), (names) => names.size >= RULES.seasonalPerSeason),
  })),
  { icon: '🍓', name: 'Polskie lato', description: 'Truskawki, czereśnie, maliny, borówki i porzeczki jednego lata', repeatable: true,
    dates: (days) => perPeriodCollected(days, (k) => ([6, 7, 8].includes(monthOf(k)) ? k.slice(0, 4) : null), (k) => namesOf(days[k]),
      (names) => RULES.polishSummer.every((need) => [need].flat().some((name) => names.has(name)))) },

  // odkrywanie
  ...TIERS.explorer.map((n, i) => ({
    icon: '🧭', name: `Odkrywca ${n}`, description: `${n} różnych warzyw i owoców`, repeatable: false, level: i + 1,
    dates: (days: Days) => collected(days, (names) => names.size >= n),
  })),
  ...TIERS.traveler.map((n, i) => ({
    icon: '🌴', name: `Podróżnik ${n}`, description: `${n} różnych owoców egzotycznych`, repeatable: false, level: i + 1,
    dates: (days: Days) => collected(days, (names) => exotic.filter((name) => names.has(name)).length >= n),
  })),
  { icon: '🎒', name: 'Kolekcjoner', description: `Wszystkie ${allBuiltIn.length} produkty z listy`, repeatable: false,
    dates: (days) => collected(days, (names) => allBuiltIn.every((n) => names.has(n))) },

  // tryb eksperta
  ...TIERS.precision.map((n, i) => ({
    icon: '⚖️', name: `Precyzja ${n}`, description: `${n} dni z wpisanymi gramami`, repeatable: false, level: i + 1,
    dates: (days: Days) => cumulative(days, (k) => (itemsOfDay(days[k]).some(({ item }) => item.grams !== undefined) ? 1 : 0), n),
  })),
]

export type BadgeStatus = Badge & { count: number; last: string | null }

/** Odznaki z licznikiem i datą ostatniego zdobycia; najpierw zdobyte (od najnowszej), potem pozostałe. */
export function badgeStatus(days: Days, mode: Mode): BadgeStatus[] {
  return BADGES.map((badge) => {
    const dates = badge.dates(days, mode)
    return { ...badge, count: dates.length, last: dates.at(-1) ?? null }
  }).sort((a, b) => (b.last ?? '').localeCompare(a.last ?? ''))
}
