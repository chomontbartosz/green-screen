// „Odkryj coś nowego”: karuzela 3 propozycji (przesuwanie palcem, strzałki, kropki) z przyciskiem „Dodaj do dziś”.
// Zasady wyboru: config/discover.ts.

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { discoverPicks } from '../config/discover'
import { newItem } from '../config/scoring'
import { useStore } from '../data/store'
import { shiftKey } from '../lib/date'
import { ProduceIcon } from './ProduceIcon'

export function DiscoverCard({ today }: { today: string }) {
  const { db, mode, dayOf, updateDay } = useStore()
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const picks = discoverPicks(db.days, shiftKey(today, -1)) // bez dzisiejszych wpisów, żeby propozycje nie zmieniały się po dodaniu
  if (picks.length === 0) return null

  const day = dayOf(today)
  const goTo = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' })

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-500">✨ Odkryj coś nowego</h2>
        <div className="flex gap-1">
          <ArrowButton label="Poprzednia propozycja" disabled={index === 0} onClick={() => goTo(index - 1)}>
            <ChevronLeft className="size-4" aria-hidden />
          </ArrowButton>
          <ArrowButton label="Następna propozycja" disabled={index === picks.length - 1} onClick={() => goTo(index + 1)}>
            <ChevronRight className="size-4" aria-hidden />
          </ArrowButton>
        </div>
      </header>

      <div
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="mt-2 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
      >
        {picks.map(({ group, produce }) => {
          const added = day[group].some((item) => item.name === produce.name)
          const add = () => updateDay(today, { ...day, [group]: [...day[group], newItem(produce.name, mode)] })
          return (
            <article key={produce.name} className="w-full shrink-0 snap-center px-1">
              <div className="flex items-center gap-3">
                <ProduceIcon group={group} name={produce.name} size="size-14" />
                <div className="flex-1">
                  <p className="font-semibold">{produce.name}</p>
                  <p className="text-sm text-stone-600">{produce.about}</p>
                </div>
              </div>
              <button
                onClick={add}
                disabled={added}
                className="mt-3 w-full rounded-full bg-brand py-2 text-sm font-semibold text-black hover:bg-brand-dark disabled:bg-stone-100 disabled:text-stone-500"
              >
                {added ? '✓ Odkryte dziś' : 'Dodaj do dziś'}
              </button>
            </article>
          )
        })}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {picks.map((p, i) => (
          <button
            key={p.produce.name}
            onClick={() => goTo(i)}
            aria-label={`Propozycja ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-5 bg-black' : 'w-2 bg-stone-300'}`}
          />
        ))}
      </div>
    </section>
  )
}

function ArrowButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 disabled:opacity-30"
    >
      {children}
    </button>
  )
}
