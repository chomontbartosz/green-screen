// Dymek produktu: duża miniatura, jedno zdanie „dlaczego warto” i witaminy/minerały w skali 1–5.

import { findProduce, GROUPS } from '../config/produce'
import { COLORS } from '../config/balance'
import { LEVELS, NUTRIENTS, type Level, type Nutrient } from '../config/nutrients'
import type { Group } from '../types'
import { ProduceImage } from './ProduceIcon'

const WIDTH = 272
const MARGIN = 8

type Props = { group: Group; name: string; anchor: DOMRect }

export function ProduceTooltip({ group, name, anchor }: Props) {
  const produce = findProduce(group, name)
  const nutrients = (Object.entries(produce?.nutrients ?? {}) as [Nutrient, Level][]).slice(0, 6) // 6 najmocniejszych

  // Pozycja: wyśrodkowany nad/pod ikoną, zawsze w obrębie ekranu
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - WIDTH / 2, MARGIN), window.innerWidth - WIDTH - MARGIN)
  const below = anchor.top < window.innerHeight / 2
  const position = below ? { top: anchor.bottom + MARGIN } : { bottom: window.innerHeight - anchor.top + MARGIN }

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-2xl border border-stone-100 bg-white p-4 text-left text-stone-800 shadow-xl"
      style={{ left, width: WIDTH, ...position }}
    >
      <div className="flex items-center gap-3">
        <ProduceImage group={group} name={name} size="size-20" />
        <div>
          <p className="text-lg font-semibold">{name}</p>
          <p className="text-xs text-stone-500">{produce ? GROUPS[group].singular : 'Własna pozycja'}</p>
          {produce && (
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
              <span className={`size-2.5 rounded-full ${COLORS[produce.color].swatch}`} />
              {COLORS[produce.color].name}
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-stone-600">{produce?.about ?? 'Brak danych o składnikach dla tej pozycji.'}</p>

      {nutrients.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {nutrients.map(([key, level]) => (
            <li key={key} className="flex items-center justify-between gap-2 text-xs">
              <span>{NUTRIENTS[key].name}</span>
              <span className="flex gap-0.5" title={LEVELS[level].label}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`h-2 w-4 rounded-full ${n <= level ? LEVELS[level].color : 'bg-stone-100'}`} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
