// Baza wiedzy → „Kolory warzyw i owoców”: 5 grup kolorów, co dają, ile tygodniowo i które produkty (dane: config/balance.ts).

import { COLOR_ORDER, COLOR_RULE, COLORS } from '../../config/balance'
import { GROUP_ORDER, PRODUCE } from '../../config/produce'
import { ProduceIcon } from '../ProduceIcon'

export function ColorsGuide() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-600">{COLOR_RULE}</p>
      {COLOR_ORDER.map((color) => {
        const { name, swatch, benefit, weeklyMin, sources } = COLORS[color]
        return (
          <section key={color} className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold">
              <span className={`size-4 rounded-full ${swatch}`} /> {name}
            </h2>
            <p className="mt-1 text-sm text-stone-600 first-letter:uppercase">{benefit}.</p>
            <p className="mt-1 text-xs text-stone-500">Cel: min. {weeklyMin} porcji tygodniowo</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {GROUP_ORDER.flatMap((group) =>
                PRODUCE[group].filter((p) => p.color === color).map((p) => <ProduceIcon key={p.name} group={group} name={p.name} size="size-9" />),
              )}
            </div>
            <p className="mt-2 text-[11px] text-stone-400">
              Źródła:{' '}
              {sources.map((source, i) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="underline">
                  {i > 0 && ', '}
                  {source.title.split(' — ')[0]}
                </a>
              ))}
            </p>
          </section>
        )
      })}
    </div>
  )
}
