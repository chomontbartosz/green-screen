// Katalog warzyw i owoców w Bazie wiedzy: odblokowane (zjedzone choć raz) w kolorze, pozostałe wyszarzone.
// Każdy produkt można otworzyć i poczytać o nim — także te jeszcze nieodblokowane.

import { Lock } from 'lucide-react'
import { useState } from 'react'
import { GROUP_ORDER, GROUPS, PRODUCE } from '../config/produce'
import { useStore } from '../data/store'
import type { Group } from '../types'
import { Modal } from './Modal'
import { ProduceImage } from './ProduceIcon'
import { ProduceInfo } from './ProduceInfo'

export function ProduceCatalog() {
  const { db } = useStore()
  const [selected, setSelected] = useState<{ group: Group; name: string } | null>(null)

  const eaten = (group: Group, name: string) =>
    Object.values(db.days).reduce((n, day) => n + day[group].filter((item) => item.name === name).length, 0)

  return (
    <div className="space-y-4">
      {GROUP_ORDER.map((group) => {
        const unlocked = PRODUCE[group].filter((p) => eaten(group, p.name) > 0).length
        return (
          <section key={group} className="rounded-2xl bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{GROUPS[group].label}</h2>
              <span className="text-sm text-stone-500">
                {unlocked} / {PRODUCE[group].length} odblokowane
              </span>
            </header>
            <ul className="grid grid-cols-4 gap-2">
              {PRODUCE[group].map((p) => {
                const count = eaten(group, p.name)
                return (
                  <li key={p.name}>
                    <button
                      onClick={() => setSelected({ group, name: p.name })}
                      className={`relative flex w-full flex-col items-center gap-1 rounded-xl p-2 text-center hover:bg-stone-50 ${count ? '' : 'opacity-50 grayscale'}`}
                    >
                      <ProduceImage group={group} name={p.name} size="size-12" />
                      <span className="text-[11px] leading-tight font-medium">{p.name}</span>
                      {count ? (
                        <span className="absolute top-1 right-1 rounded-full bg-brand px-1.5 text-[10px] font-bold text-black">×{count}</span>
                      ) : (
                        <Lock className="absolute top-1 right-1 size-3.5 text-stone-500" aria-label="Nieodblokowane" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <Modal open={!!selected} onClose={() => setSelected(null)} label={selected?.name ?? ''}>
        {selected && (
          <section className="rounded-3xl bg-white p-5 text-stone-800">
            <ProduceInfo group={selected.group} name={selected.name} showSeason />
            <p className="mt-4 rounded-xl bg-stone-50 p-3 text-sm">
              {eaten(selected.group, selected.name)
                ? `✅ Odblokowane: zjedzone ${eaten(selected.group, selected.name)} razy`
                : '🔒 Jeszcze nie odblokowane — dodaj je na ekranie „Dziś”, gdy pojawi się na talerzu.'}
            </p>
          </section>
        )}
      </Modal>
    </div>
  )
}
