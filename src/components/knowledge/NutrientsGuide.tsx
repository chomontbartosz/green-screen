// Baza wiedzy → „Witaminy i minerały”: do czego służy każdy składnik i gdzie go najwięcej (dane: config/nutrients.ts).

import { CHARTS, NUTRIENTS, NUTRITION, type Chart, type Nutrient } from '../../config/nutrients'
import { ALL_PRODUCE } from '../../config/produce'
import { ProduceIcon } from '../ProduceIcon'

/** 5 produktów z najwyższą zawartością składnika (co najmniej „średnio”). */
const bestSources = (nutrient: Nutrient) =>
  ALL_PRODUCE.filter(({ produce }) => (produce.nutrients[nutrient] ?? 0) >= 3)
    .sort((a, b) => (b.produce.nutrients[nutrient] ?? 0) - (a.produce.nutrients[nutrient] ?? 0))
    .slice(0, 5)

export function NutrientsGuide() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600">
        Nie każdy składnik musi być codziennie — normy dzienne to średnie, a część witamin organizm magazynuje. Dlatego wykresy na ekranie „Start”
        liczą ostatnie {NUTRITION.windowDays} dni.
      </p>
      {(Object.keys(CHARTS) as Chart[]).map((chart) => (
        <section key={chart} className="space-y-2">
          <h2 className="text-lg font-semibold">{CHARTS[chart]}</h2>
          {(Object.keys(NUTRIENTS) as Nutrient[])
            .filter((n) => NUTRIENTS[n].chart === chart)
            .map((n) => {
              const { name, role, ...rest } = NUTRIENTS[n]
              const note = 'note' in rest ? rest.note : null
              const sources = bestSources(n)
              return (
                <article key={n} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-stone-600">Wspiera: {role}</p>
                  {note && <p className="mt-1 text-xs text-stone-500">{note}</p>}
                  {sources.length > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="mr-1 text-xs text-stone-500">Najwięcej w:</span>
                      {sources.map(({ group, produce }) => (
                        <ProduceIcon key={produce.name} group={group} name={produce.name} size="size-8" />
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
        </section>
      ))}
      <a href={NUTRITION.source.url} target="_blank" rel="noreferrer" className="block text-[11px] text-stone-400 underline">
        Normy: {NUTRITION.source.title}
      </a>
    </div>
  )
}
