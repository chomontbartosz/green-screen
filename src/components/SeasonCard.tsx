// „W sezonie”: polskie warzywa i owoce sezonowe w miesiącu oglądanym w kalendarzu (sezony: config/produce.ts).
// Zielony ✓ przy ikonie = ten produkt był już na talerzu w tym miesiącu.

import { Check } from 'lucide-react'
import { inSeason, monthName } from '../config/discover'
import { GROUP_ORDER } from '../config/produce'
import { useStore } from '../data/store'
import { toKey } from '../lib/date'
import { ProduceIcon } from './ProduceIcon'

export function SeasonCard({ month }: { month: Date }) {
  const { db } = useStore()
  const list = inSeason(month)
  if (list.length === 0) return null

  const prefix = toKey(month).slice(0, 7) // RRRR-MM
  const eaten = new Set(
    Object.entries(db.days)
      .filter(([key]) => key.startsWith(prefix))
      .flatMap(([, day]) => GROUP_ORDER.flatMap((g) => day[g].map((item) => item.name))),
  )
  const done = list.filter(({ produce }) => eaten.has(produce.name)).length

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-stone-500">🗓️ W {monthName(month)} w sezonie</h2>
        <span className="text-xs text-stone-500">
          {done} / {list.length} na talerzu
        </span>
      </header>
      <p className="mt-1 text-xs text-stone-400">Lokalne, tańsze i najsmaczniejsze właśnie wtedy.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {list.map(({ group, produce }) => (
          <span key={produce.name} className="relative">
            <ProduceIcon group={group} name={produce.name} size="size-9" />
            {eaten.has(produce.name) && (
              <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-brand ring-2 ring-white" title="Już w tym miesiącu">
                <Check className="size-3 text-black" strokeWidth={3.5} aria-label="Zjedzone w tym miesiącu" />
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}
