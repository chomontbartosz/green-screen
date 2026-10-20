// Katalog warzyw i owoców w Bazie wiedzy: odblokowane (zjedzone choć raz) w kolorze, pozostałe wyszarzone.
// Każdy produkt można otworzyć i poczytać o nim — także te jeszcze nieodblokowane. Sortowanie: tematycznie, A–Z, kolorami.

import { Lock } from 'lucide-react'
import { useState } from 'react'
import { COLOR_ORDER } from '../config/balance'
import { GROUP_ORDER, GROUPS, itemsOfDay, PRODUCE, type Produce } from '../config/produce'
import { useStore } from '../data/store'
import type { Group } from '../types'
import { Modal } from './Modal'
import { ProduceImage } from './ProduceIcon'
import { ProduceInfo } from './ProduceInfo'

const SORTS = {
  default: { label: 'Domyślnie', sort: (list: Produce[]) => list }, // tematycznie, jak w config/produce.ts
  alpha: { label: 'A–Z', sort: (list: Produce[]) => [...list].sort((a, b) => a.name.localeCompare(b.name, 'pl')) },
  color: { label: 'Kolorami', sort: (list: Produce[]) => [...list].sort((a, b) => COLOR_ORDER.indexOf(a.color) - COLOR_ORDER.indexOf(b.color)) },
}
type Sort = keyof typeof SORTS

export function ProduceCatalog() {
  const { db } = useStore()
  const [selected, setSelected] = useState<{ group: Group; name: string } | null>(null)
  const [sort, setSort] = useState<Sort>('default')

  const counts = new Map<string, number>()
  Object.values(db.days).flatMap(itemsOfDay).forEach(({ group, item }) => counts.set(`${group}:${item.name}`, (counts.get(`${group}:${item.name}`) ?? 0) + 1))
  const eaten = (group: Group, name: string) => counts.get(`${group}:${name}`) ?? 0

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm" role="group" aria-label="Sortowanie">
        {(Object.keys(SORTS) as Sort[]).map((key) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            aria-pressed={sort === key}
            className={`flex-1 rounded-full py-1.5 text-sm font-semibold ${sort === key ? 'bg-black text-white' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            {SORTS[key].label}
          </button>
        ))}
      </div>
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
              {SORTS[sort].sort(PRODUCE[group]).map((p) => {
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
