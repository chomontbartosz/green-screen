// PUNKTACJA — jedyne miejsce z celami, wagami i formułą wyniku dnia (0–100).

import type { DayEntry, Item, Mode } from '../types'
import { COLOR_ORDER, dayColors } from './balance'
import { findAny, hasTag } from './produce'

export const SCORING = {
  goal: { vegetables: 5, fruits: 5 }, // dzienny cel porcji
  weights: { vegetables: 35, fruits: 35, colors: 20, variety: 10 }, // suma = 100 pkt, 30 pkt za różnorodność
  varietyGoal: 6, // ile RÓŻNYCH produktów dziennie daje pełne punkty za różnorodność
  portionGrams: 80, // tryb eksperta: tyle gramów = 1 porcja (garść ≈ 80 g); wyjątki (np. suszone 30 g) w produce.ts
  legumesMaxPortions: 1, // strączki (fasola, ciecierzyca, soczewica) liczą się maks. 1 porcja dziennie
}

/** Ile gramów to 1 porcja danego produktu (zwykle 80 g, suszone owoce 30 g). */
export const portionGramsOf = (name: string) => findAny(name)?.portionGrams ?? SCORING.portionGrams

/** Porcje jednej pozycji: w trybie podstawowym 1, w trybie eksperta gramy / gramy porcji. */
export const itemPortions = (item: Item, mode: Mode) => (mode === 'basic' ? 1 : (item.grams ?? portionGramsOf(item.name)) / portionGramsOf(item.name))

/** Nowa pozycja: w trybie eksperta od razu z gramaturą jednej porcji. */
export const newItem = (name: string, mode: Mode): Item => (mode === 'expert' ? { name, grams: portionGramsOf(name) } : { name })

export const isLegume = (item: Item) => hasTag(item.name, 'strączki')

/** Porcje zaliczone do celu z listy pozycji jednego dnia — strączki najwyżej `legumesMaxPortions`. */
export function portions(items: Item[], mode: Mode): number {
  const sum = (list: Item[]) => list.reduce((total, item) => total + itemPortions(item, mode), 0)
  return sum(items.filter((i) => !isLegume(i))) + Math.min(sum(items.filter(isLegume)), SCORING.legumesMaxPortions)
}

/** Ile różnych produktów zjedzono danego dnia. */
export const distinctProducts = (day: DayEntry) => new Set([...day.vegetables, ...day.fruits].map((item) => item.name)).size

/** 3 → „3”, 2.5 → „2,5” */
export const formatPortions = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','))

/**
 * Wynik = (porcje warzyw / 5) × 35 + (porcje owoców / 5) × 35 + (kolory / 5) × 20 + (różne produkty / 6) × 10.
 * Przykład: 5 bananów + 5 jabłek to tylko 2 kolory i 2 produkty — wynik niższy niż przy kolorowym talerzu.
 * Kolory produktów i ich znaczenie: config/balance.ts.
 * Każda część jest ograniczona do 100% — nadwyżka nie daje dodatkowych punktów.
 */
export function calculateScore(day: DayEntry, mode: Mode): number {
  const part = (value: number, goal: number, weight: number) => Math.min(value / goal, 1) * weight
  const { goal, weights, varietyGoal } = SCORING

  return Math.round(
    part(portions(day.vegetables, mode), goal.vegetables, weights.vegetables) +
      part(portions(day.fruits, mode), goal.fruits, weights.fruits) +
      part(dayColors(day).size, COLOR_ORDER.length, weights.colors) +
      part(distinctProducts(day), varietyGoal, weights.variety),
  )
}

/** Krótki komentarz i kolor do wyniku. */
export function scoreLevel(score: number) {
  if (score >= 90) return { label: 'Perfekcyjnie!', color: 'bg-brand', text: 'text-black' }
  if (score >= 60) return { label: 'Dobrze idzie', color: 'bg-lime-400', text: 'text-black' }
  if (score >= 30) return { label: 'Jeszcze trochę', color: 'bg-amber-300', text: 'text-black' }
  if (score > 0) return { label: 'Dobry początek', color: 'bg-orange-300', text: 'text-black' }
  return { label: 'Nic jeszcze', color: 'bg-stone-200', text: 'text-stone-500' }
}
