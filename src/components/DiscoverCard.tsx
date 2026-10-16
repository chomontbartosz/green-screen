// „Odkryj coś nowego”: jeden produkt dnia, którego dawno nie było, z przyciskiem „Dodaj do dziś” (zasady: config/discover.ts).

import { discoverPick } from '../config/discover'
import { SCORING } from '../config/scoring'
import { useStore } from '../data/store'
import { shiftKey } from '../lib/date'
import { ProduceIcon } from './ProduceIcon'

export function DiscoverCard({ today }: { today: string }) {
  const { db, mode, dayOf, updateDay } = useStore()
  const pick = discoverPick(db.days, shiftKey(today, -1)) // bez dzisiejszych wpisów, żeby propozycja nie zmieniała się po dodaniu
  if (!pick) return null

  const { group, produce } = pick
  const day = dayOf(today)
  const added = day[group].some((item) => item.name === produce.name)
  const add = () => updateDay(today, { ...day, [group]: [...day[group], mode === 'expert' ? { name: produce.name, grams: SCORING.portionGrams } : { name: produce.name }] })

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-stone-500">✨ Odkryj coś nowego</h2>
      <div className="mt-2 flex items-center gap-3">
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
    </section>
  )
}
