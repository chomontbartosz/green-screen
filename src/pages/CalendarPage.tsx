// Strona „Kalendarz”: miesiąc z podsumowaniem porcji każdego dnia, sezon w tym miesiącu, podgląd i edycja dni z przeszłości.

import { useState } from 'react'
import { DayEditor } from '../components/DayEditor'
import { DaySummary } from '../components/DaySummary'
import { SeasonCard } from '../components/SeasonCard'
import { calculateScore, formatPortions, portions, scoreLevel } from '../config/scoring'
import { useStore } from '../data/store'
import { formatLong, formatMonth, toKey } from '../lib/date'

const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd']

export function CalendarPage({ today }: { today: string }) {
  const { mode, dayOf, updateDay } = useStore()
  const [month, setMonth] = useState(() => new Date(`${today.slice(0, 7)}-01T00:00:00`))
  const [selected, setSelected] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const shiftMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))
  const select = (key: string) => {
    setSelected(key)
    setEditing(false)
  }

  // Dni miesiąca + puste pola na początku, żeby tydzień zaczynał się od poniedziałku
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const offset = (month.getDay() + 6) % 7
  const keys = Array.from({ length: daysInMonth }, (_, i) => toKey(new Date(month.getFullYear(), month.getMonth(), i + 1)))

  const loggedScores = keys.map((k) => calculateScore(dayOf(k), mode)).filter((score) => score > 0)
  const average = loggedScores.length ? Math.round(loggedScores.reduce((a, b) => a + b, 0) / loggedScores.length) : 0

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <header className="mb-3 flex items-center justify-between">
          <button onClick={() => shiftMonth(-1)} className="rounded-full px-3 py-1 hover:bg-stone-100" aria-label="Poprzedni miesiąc">
            ‹
          </button>
          <div className="text-center">
            <h1 className="font-semibold first-letter:uppercase">{formatMonth(month)}</h1>
            <p className="text-xs text-stone-500">
              średnio {average} pkt · {loggedScores.length} dni z wpisami
            </p>
          </div>
          <button onClick={() => shiftMonth(1)} className="rounded-full px-3 py-1 hover:bg-stone-100" aria-label="Następny miesiąc">
            ›
          </button>
        </header>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-1 text-stone-400">
              {w}
            </div>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {keys.map((key) => {
            const day = dayOf(key)
            const future = key > today
            const level = scoreLevel(calculateScore(day, mode))
            return (
              <button
                key={key}
                disabled={future}
                onClick={() => select(key)}
                className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 disabled:opacity-30
                  ${key === selected ? 'border-brand' : 'border-transparent'} ${key === today ? 'font-bold' : ''} hover:bg-stone-50`}
              >
                <span>{Number(key.slice(8))}</span>
                {!future && (
                  <span className="text-[10px] leading-tight text-stone-500">
                    {formatPortions(portions(day.vegetables, mode))}·{formatPortions(portions(day.fruits, mode))}
                  </span>
                )}
                <span className={`mt-0.5 h-1 w-4 rounded-full ${future ? '' : level.color}`} />
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-center text-[10px] text-stone-400">liczby = porcje warzyw · owoców</p>
      </section>

      {selected && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold first-letter:uppercase">{formatLong(selected)}</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="rounded-full bg-brand px-4 py-1.5 text-sm text-black hover:bg-brand-dark"
            >
              {editing ? 'Gotowe' : 'Edytuj'}
            </button>
          </div>

          {editing ? (
            <DayEditor key={selected} day={dayOf(selected)} onChange={(day) => updateDay(selected, day)} />
          ) : (
            <DaySummary day={dayOf(selected)} />
          )}
        </section>
      )}

      <SeasonCard month={month} />
    </div>
  )
}
