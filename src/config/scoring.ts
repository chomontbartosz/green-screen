// PUNKTACJA — jedyne miejsce z celami, wagami i formułą wyniku dnia (0–100).

import type { DayEntry, Item, Mode } from '../types'
import { COLOR_ORDER, dayColors } from './balance'

export const SCORING = {
  goal: { vegetables: 5, fruits: 5 }, // dzienny cel porcji
  weights: { vegetables: 35, fruits: 35, colors: 20, variety: 10 }, // suma = 100 pkt, 30 pkt za różnorodność
  varietyGoal: 6, // ile RÓŻNYCH produktów dziennie daje pełne punkty za różnorodność
  portionGrams: 80, // tryb eksperta: tyle gramów = 1 porcja (garść ≈ 80–100 g)
}

/** Liczba porcji: w trybie podstawowym 1 pozycja = 1 porcja, w trybie eksperta gramy / 80. */
export function portions(items: Item[], mode: Mode): number {
  if (mode === 'basic') return items.length
  return items.reduce((sum, item) => sum + (item.grams ?? SCORING.portionGrams), 0) / SCORING.portionGrams
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
