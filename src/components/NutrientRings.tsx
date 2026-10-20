// Wykres pierścieniowy: każdy wycinek to składnik, 0–5 wypełnionych pierścieni = ile go było w ostatnich dniach (NUTRITION.windowDays).
// Po najechaniu (lub stuknięciu) dymek podpowiada, co jeść. Obliczenia: config/nutrients.ts.

import { useState } from 'react'
import { CHARTS, NUTRIENTS, NUTRITION, type Chart, type Coverage } from '../config/nutrients'

const R_INNER = 24 // promień środka
const RING = 13 // grubość pierścienia
const GAP = 2 // odstęp między pierścieniami i wycinkami (px)
const R_OUTER = R_INNER + NUTRITION.rings * RING
const R_LABEL = R_OUTER + 12
const SIZE = (R_LABEL + 12) * 2

/** Ścieżka SVG wycinka pierścienia od kąta a1 do a2 (radiany, 0 = góra). */
function sector(r1: number, r2: number, a1: number, a2: number) {
  const point = (r: number, a: number) => `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`
  const large = a2 - a1 > Math.PI ? 1 : 0
  return `M${point(r2, a1)} A${r2} ${r2} 0 ${large} 1 ${point(r2, a2)} L${point(r1, a2)} A${r1} ${r1} 0 ${large} 0 ${point(r1, a1)} Z`
}

type Props = { chart: Chart; coverage: Coverage[] }

export function NutrientRings({ chart, coverage }: Props) {
  const slices = coverage.filter((c) => NUTRIENTS[c.nutrient].chart === chart)
  const [active, setActive] = useState<Coverage | null>(null)
  const step = (2 * Math.PI) / slices.length

  return (
    <figure className="relative flex flex-col items-center" onMouseLeave={() => setActive(null)}>
      <figcaption className="mb-1 text-sm font-semibold">{CHARTS[chart]}</figcaption>
      <svg viewBox={`${-SIZE / 2} ${-SIZE / 2} ${SIZE} ${SIZE}`} className="w-full max-w-64" role="img" aria-label={CHARTS[chart]}>
        {slices.map((slice, i) => {
          const a1 = i * step
          const a2 = a1 + step
          const pad = GAP / R_OUTER // stały odstęp między wycinkami
          const mid = a1 + step / 2
          const isActive = active?.nutrient === slice.nutrient
          const dim = active && !isActive
          return (
            <g
              key={slice.nutrient}
              className={`cursor-pointer transition-opacity ${dim ? 'opacity-40' : ''}`}
              onMouseEnter={() => setActive(slice)}
              onClick={() => setActive(slice)}
            >
              {Array.from({ length: NUTRITION.rings }, (_, ring) => {
                const r1 = R_INNER + ring * RING
                return (
                  <path
                    key={ring}
                    d={sector(r1, r1 + RING - GAP, a1 + pad, a2 - pad)}
                    className={ring < slice.rings ? 'fill-brand-strong' : isActive ? 'fill-stone-300' : 'fill-stone-100'}
                  />
                )
              })}
              {/* wskazany wycinek: obrys, żeby był widoczny także wtedy, gdy jest pusty */}
              {isActive && <path d={sector(R_INNER, R_OUTER - GAP, a1 + pad, a2 - pad)} className="fill-none stroke-stone-800" strokeWidth={1.5} />}
              {/* większe pole najechania niż sam wycinek */}
              <path d={sector(R_INNER, R_LABEL + 8, a1, a2)} className="fill-transparent" />
              <text
                x={R_LABEL * Math.sin(mid)}
                y={-R_LABEL * Math.cos(mid)}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-stone-500 text-[10px] font-semibold"
              >
                {NUTRIENTS[slice.nutrient].short}
              </text>
            </g>
          )
        })}
      </svg>

      {/* wersja tekstowa dla czytników ekranu */}
      <ul className="sr-only">
        {slices.map((s) => (
          <li key={s.nutrient}>
            {NUTRIENTS[s.nutrient].name}: {s.rings} z {NUTRITION.rings}
          </li>
        ))}
      </ul>

      {active && <RingTooltip coverage={active} />}
    </figure>
  )
}

function RingTooltip({ coverage }: { coverage: Coverage }) {
  const { name, role, ...rest } = NUTRIENTS[coverage.nutrient]
  const note = 'note' in rest ? rest.note : null
  const full = coverage.rings >= NUTRITION.rings

  return (
    <div className="pointer-events-none absolute top-8 left-1/2 z-10 w-60 -translate-x-1/2 rounded-2xl bg-white p-3 text-xs shadow-xl">
      <p className="flex items-center justify-between text-sm font-semibold">
        {name}
        <span className="flex gap-0.5">
          {Array.from({ length: NUTRITION.rings }, (_, i) => (
            <span key={i} className={`size-2 rounded-full ${i < coverage.rings ? 'bg-brand-strong' : 'bg-stone-200'}`} />
          ))}
        </span>
      </p>
      <p className="text-stone-500">Wspiera: {role}</p>
      <p className="mt-1.5 text-stone-700">
        {full ? 'Świetnie, tak trzymaj!' : `Więcej jedz: ${coverage.bestSources.join(', ')}.`}
      </p>
      {note && <p className="mt-1.5 text-stone-500">{note}</p>}
    </div>
  )
}
