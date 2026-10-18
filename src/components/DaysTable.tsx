// Tabela dni: ostatnie dni jako wiersze z samymi ikonkami i wynikiem (część ekranu „Start”).
// Zaczyna się od pierwszej wizyty (albo od najstarszego wpisu, jeśli jest wcześniejszy), bez starych pustych dni.

import { useState } from 'react'
import { ProduceIcon } from './ProduceIcon'
import { GROUP_ORDER, GROUPS } from '../config/produce'
import { calculateScore, scoreLevel } from '../config/scoring'
import { useStore } from '../data/store'
import { daysBetween, fromKey, pastKeys } from '../lib/date'

const PAGE = 30 // ile dni pokazać naraz

const shortDate = (key: string) => fromKey(key).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' })

export function DaysTable({ today }: { today: string }) {
  const { db, mode, dayOf } = useStore()
  const [count, setCount] = useState(PAGE)

  const firstDay = [db.settings.startDate ?? today, ...Object.keys(db.days)].sort()[0]
  const total = Math.max(daysBetween(firstDay, today) + 1, 1)
  const keys = pastKeys(today, Math.min(count, total))

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-xs text-stone-500">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Dzień</th>
            {GROUP_ORDER.map((group) => (
              <th key={group} className="px-2 py-2 text-left font-medium">
                {GROUPS[group].label}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-medium">Pkt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {keys.map((key) => {
            const day = dayOf(key)
            const score = calculateScore(day, mode)
            const level = scoreLevel(score)
            return (
              <tr key={key} className={key === today ? 'bg-brand-soft/60' : ''}>
                <td className="px-3 py-2 align-top text-xs whitespace-nowrap text-stone-500">{key === today ? 'dziś' : shortDate(key)}</td>
                {GROUP_ORDER.map((group) => (
                  <td key={group} className="px-2 py-2 align-top">
                    <div className="flex flex-wrap gap-0.5">
                      {day[group].map((item, i) => (
                        <ProduceIcon key={i} group={group} name={item.name} size="size-7" />
                      ))}
                      {day[group].length === 0 && <span className="text-stone-300">—</span>}
                    </div>
                  </td>
                ))}
                <td className="px-3 py-2 text-right align-top">
                  <span className={`inline-block min-w-8 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold ${level.color} ${level.text}`}>
                    {score}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {count < total && (
        <button onClick={() => setCount(count + PAGE)} className="w-full py-3 text-sm text-brand-ink hover:bg-stone-50">
          Pokaż starsze dni
        </button>
      )}
    </section>
  )
}
