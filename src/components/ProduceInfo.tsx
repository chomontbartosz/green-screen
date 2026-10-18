// Opis produktu: miniatura, grupa i kolor, zdanie „dlaczego warto” i składniki w skali 1–5.
// Używany w dymku ikonki (ProduceTooltip) i w Bazie wiedzy.

import { COLORS } from '../config/balance'
import { LEVELS, NUTRIENTS, type Level, type Nutrient } from '../config/nutrients'
import { findProduce, GROUPS } from '../config/produce'
import type { Group } from '../types'
import { ProduceImage } from './ProduceIcon'

const MONTHS = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru']

type Props = { group: Group; name: string; maxNutrients?: number; showSeason?: boolean }

export function ProduceInfo({ group, name, maxNutrients = Infinity, showSeason = false }: Props) {
  const produce = findProduce(group, name)
  const nutrients = (Object.entries(produce?.nutrients ?? {}) as [Nutrient, Level][]).slice(0, maxNutrients)

  return (
    <>
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

      {showSeason && produce && (
        <p className="mt-2 text-xs text-stone-500">
          🗓️ Sezon w Polsce: {produce.season.length ? produce.season.map((m) => MONTHS[m - 1]).join(', ') : 'import, w sklepach cały rok'}
        </p>
      )}

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
    </>
  )
}
