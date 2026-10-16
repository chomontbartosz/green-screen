// Wieczorne przypomnienie na ekranie „Dziś”, jeśli brakuje porcji do celu (godzina i treść: config/reminders.ts).

import { GROUP_ORDER, GROUPS } from '../config/produce'
import { REMINDER } from '../config/reminders'
import { formatPortions, portions, SCORING } from '../config/scoring'
import { useStore } from '../data/store'
import type { DayEntry } from '../types'

export function Reminder({ day, now }: { day: DayEntry; now: Date }) {
  const { mode } = useStore()
  if (now.getHours() < REMINDER.fromHour) return null

  const missing = GROUP_ORDER.map((g) => ({ g, left: SCORING.goal[g] - portions(day[g], mode) })).filter(({ left }) => left > 0)
  if (missing.length === 0) return null

  const list = missing.map(({ g, left }) => `${formatPortions(left)} porcji ${GROUPS[g].genitive}`).join(' i ')

  return (
    <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
      <h2 className="font-semibold text-amber-900">⏰ Do celu brakuje jeszcze: {list}</h2>
      <p className="mt-1 text-sm text-amber-800">{REMINDER.idea}</p>
    </section>
  )
}
