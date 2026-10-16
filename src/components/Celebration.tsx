// Mała nagroda: deszcz ikonek i napis, gdy wynik dnia dobije do 100 pkt. Animacja „fall” jest w index.css.

import { useEffect, useState } from 'react'
import { GROUP_ORDER, PRODUCE } from '../config/produce'
import { ProduceImage } from './ProduceIcon'

const DURATION = 3000 // ms
const PIECES = Array.from({ length: 24 }, (_, i) => {
  const group = GROUP_ORDER[i % 2]
  const list = PRODUCE[group]
  return { group, name: list[(i * 7) % list.length].name, left: (i * 41) % 100, delay: (i % 8) * 120 }
})

/** `trigger` rośnie o 1 za każdym razem, gdy trzeba pokazać nagrodę. */
export function Celebration({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (trigger === 0) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), DURATION)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-live="polite">
      {PIECES.map((p, i) => (
        <span key={i} className="absolute -top-12 animate-fall" style={{ left: `${p.left}%`, animationDelay: `${p.delay}ms` }}>
          <ProduceImage group={p.group} name={p.name} size="size-10" />
        </span>
      ))}
      <p className="absolute inset-x-0 top-1/3 animate-celebrate text-center text-4xl font-extrabold text-black drop-shadow-[0_2px_0_white]">
        100 pkt! 🎉
        <span className="block text-lg">Perfekcyjny dzień</span>
      </p>
    </div>
  )
}
