// Dymek ikonki produktu: pływający nad/pod ikoną, zawsze w obrębie ekranu. Treść: ProduceInfo.

import type { Group } from '../types'
import { ProduceInfo } from './ProduceInfo'

const WIDTH = 272
const MARGIN = 8

type Props = { group: Group; name: string; anchor: DOMRect }

export function ProduceTooltip({ group, name, anchor }: Props) {
  const left = Math.min(Math.max(anchor.left + anchor.width / 2 - WIDTH / 2, MARGIN), window.innerWidth - WIDTH - MARGIN)
  const below = anchor.top < window.innerHeight / 2
  const position = below ? { top: anchor.bottom + MARGIN } : { bottom: window.innerHeight - anchor.top + MARGIN }

  return (
    <div
      className="pointer-events-none fixed z-50 rounded-2xl border border-stone-100 bg-white p-4 text-left text-stone-800 shadow-xl"
      style={{ left, width: WIDTH, ...position }}
    >
      <ProduceInfo group={group} name={name} maxNutrients={6} />
    </div>
  )
}
