// Podgląd dnia (bez edycji): wynik i ikonki zjedzonych porcji w każdej grupie.

import { GROUP_ORDER, GROUPS } from '../config/produce'
import { calculateScore, formatPortions, portions } from '../config/scoring'
import { useStore } from '../data/store'
import type { DayEntry } from '../types'
import { ProduceIcon } from './ProduceIcon'

export function DaySummary({ day }: { day: DayEntry }) {
  const { mode } = useStore()

  return (
    <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm text-stone-500">Wynik: {calculateScore(day, mode)} / 100 pkt</p>
      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <h3 className="mb-1 text-sm font-medium">
            {GROUPS[group].label} ({formatPortions(portions(day[group], mode))} porcji)
          </h3>
          <div className="flex flex-wrap gap-1">
            {day[group].length ? (
              day[group].map((item, i) => <ProduceIcon key={i} group={group} name={item.name} size="size-9" />)
            ) : (
              <span className="text-sm text-stone-400">brak</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
