// Wyróżniona karta na ekranie „Start”: ile porcji warzyw i owoców jest dziś + przycisk przejścia do „Dziś”.

import { ArrowRight } from 'lucide-react'
import { GROUP_ORDER, GROUPS } from '../config/produce'
import { formatPortions, portions, SCORING } from '../config/scoring'
import { useStore } from '../data/store'

type Props = { today: string; onAdd: () => void }

export function TodayProgress({ today, onAdd }: Props) {
  const { mode, dayOf } = useStore()
  const day = dayOf(today)
  const progress = GROUP_ORDER.map((g) => ({ g, have: portions(day[g], mode), goal: SCORING.goal[g] }))
  const done = progress.every(({ have, goal }) => have >= goal)

  return (
    <section className="rounded-2xl bg-brand p-4 text-black">
      <h2 className="font-extrabold">{done ? 'Cel 5 + 5 na dziś osiągnięty! 🎉' : 'Dziś na talerzu'}</h2>
      <ul className="mt-2 space-y-2">
        {progress.map(({ g, have, goal }) => (
          <li key={g} className="text-sm">
            <span className="flex justify-between font-semibold">
              {GROUPS[g].label}
              <span>
                {formatPortions(have)} / {goal} porcji
              </span>
            </span>
            <span className="mt-1 block h-2 overflow-hidden rounded-full bg-white/60">
              <span className="block h-full rounded-full bg-black" style={{ width: `${Math.min(have / goal, 1) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onAdd}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
      >
        {done ? 'Zobacz dzisiejszy dzień' : 'Dodaj więcej'} <ArrowRight className="size-4" aria-hidden />
      </button>
    </section>
  )
}
