// Wynik dnia 0–100 z paskiem postępu i kolorami dnia. Formuła: config/scoring.ts, kolory: config/balance.ts.
// Gdy wynik dobije do 100 pkt, pokazuje nagrodę (Celebration).

import { useEffect, useRef, useState } from 'react'
import { COLOR_ORDER, COLORS, dayColors } from '../config/balance'
import { calculateScore, distinctProducts, SCORING, scoreLevel } from '../config/scoring'
import { useStore } from '../data/store'
import type { DayEntry } from '../types'
import { Celebration } from './Celebration'

export function ScoreCard({ day }: { day: DayEntry }) {
  const { mode } = useStore()
  const score = calculateScore(day, mode)
  const { label, color } = scoreLevel(score)
  const colors = dayColors(day)
  const [celebrate, setCelebrate] = useState(0)
  const previous = useRef(score)

  useEffect(() => {
    if (previous.current < 100 && score === 100) setCelebrate((n) => n + 1)
    previous.current = score
  }, [score])

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <span className="text-4xl font-bold">
          {score}
          <span className="text-base font-normal text-stone-400"> / 100 pkt</span>
        </span>
        <span className="text-sm text-stone-500">{label}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-100">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs whitespace-nowrap text-stone-500">
        <span className="flex items-center gap-1.5">
          Kolory {colors.size}/{COLOR_ORDER.length}
          {COLOR_ORDER.map((c) => (
            <span
              key={c}
              title={COLORS[c].name}
              className={`size-4 rounded-full ${colors.has(c) ? COLORS[c].swatch : 'border-2 border-dashed border-stone-200'}`}
            />
          ))}
        </span>
        <span>
          Różne produkty {distinctProducts(day)}
          {distinctProducts(day) >= SCORING.varietyGoal ? ' ✓' : `/${SCORING.varietyGoal}`}
        </span>
      </div>
      <Celebration trigger={celebrate} />
    </section>
  )
}
