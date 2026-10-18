// „W sezonie”: polskie warzywa i owoce sezonowe w miesiącu oglądanym w kalendarzu (sezony: config/produce.ts).

import { inSeason, monthName } from '../config/discover'
import { ProduceIcon } from './ProduceIcon'

export function SeasonCard({ month }: { month: Date }) {
  const list = inSeason(month)
  if (list.length === 0) return null

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-stone-500">🗓️ W {monthName(month)} w sezonie</h2>
      <p className="mt-1 text-xs text-stone-400">Lokalne, tańsze i najsmaczniejsze właśnie wtedy.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {list.map(({ group, produce }) => (
          <ProduceIcon key={produce.name} group={group} name={produce.name} size="size-9" />
        ))}
      </div>
    </section>
  )
}
