// Jedna grupa (Warzywa albo Owoce): nagłówek z licznikiem porcji, wiersze z wyborem i przycisk „+”.
// W trybie eksperta przy każdym wierszu jest pole na gramy. Po usunięciu pozycji przez chwilę widać „Cofnij”.

import { useEffect, useState } from 'react'
import { GROUPS, productNames } from '../config/produce'
import { formatPortions, portions, SCORING } from '../config/scoring'
import { useStore } from '../data/store'
import type { Group, Item } from '../types'
import { ProduceIcon } from './ProduceIcon'
import { ProduceSelect } from './ProduceSelect'

type Props = { group: Group; items: Item[]; onChange: (items: Item[]) => void }

const UNDO_SECONDS = 6 // jak długo widać „Cofnij” po usunięciu

export function GroupSection({ group, items, onChange }: Props) {
  const { db, mode } = useStore()
  const [extraRows, setExtraRows] = useState(0)
  const [removed, setRemoved] = useState<{ item: Item; index: number } | null>(null)
  const emptyRows = Math.max(extraRows, items.length === 0 ? 1 : 0) // zawsze co najmniej jeden wiersz
  const { label, placeholder } = GROUPS[group]
  const options = productNames(group, db.days)
  const expert = mode === 'expert'
  const total = portions(items, mode)
  const goal = SCORING.goal[group]

  const update = (i: number, change: Partial<Item>) => onChange(items.map((item, j) => (j === i ? { ...item, ...change } : item)))
  const remove = (i: number) => {
    setRemoved({ item: items[i], index: i })
    onChange(items.filter((_, j) => j !== i))
  }
  const undo = () => {
    if (!removed) return
    onChange([...items.slice(0, removed.index), removed.item, ...items.slice(removed.index)])
    setRemoved(null)
  }

  useEffect(() => {
    if (!removed) return
    const timer = setTimeout(() => setRemoved(null), UNDO_SECONDS * 1000)
    return () => clearTimeout(timer)
  }, [removed])
  const add = (name: string) => {
    onChange([...items, expert ? { name, grams: SCORING.portionGrams } : { name }])
    setExtraRows((n) => Math.max(n - 1, 0))
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>
        <span className={`text-sm font-medium ${total >= goal ? 'text-brand-ink' : 'text-stone-500'}`}>
          {formatPortions(total)} / {goal} porcji
        </span>
      </header>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <ProduceIcon group={group} name={item.name} />
            <ProduceSelect options={options} value={item.name} placeholder={placeholder} onSelect={(name) => update(i, { name })} />
            {expert && <GramsInput value={item.grams ?? SCORING.portionGrams} onChange={(grams) => update(i, { grams })} />}
            <RemoveButton onClick={() => remove(i)} />
          </div>
        ))}
        {Array.from({ length: emptyRows }, (_, i) => (
          <div key={`empty-${i}`} className="flex items-center gap-2">
            <span className="size-10 shrink-0 rounded-full border-2 border-dashed border-stone-200" />
            <ProduceSelect options={options} value="" placeholder={placeholder} onSelect={add} autoFocus={extraRows > 0} />
            {expert && <span className="w-20 shrink-0" />}
            <RemoveButton onClick={() => setExtraRows((n) => Math.max(n - 1, 0))} hidden={items.length === 0 && emptyRows === 1} />
          </div>
        ))}
      </div>

      {removed && (
        <p className="mt-2 flex items-center justify-between rounded-lg bg-stone-800 px-3 py-2 text-sm text-white">
          Usunięto: {removed.item.name}
          <button onClick={undo} className="font-semibold text-brand">
            Cofnij
          </button>
        </p>
      )}

      <button
        onClick={() => setExtraRows(emptyRows + 1)}
        className="mt-3 flex size-10 items-center justify-center rounded-full bg-brand text-2xl text-black hover:bg-brand-dark"
        aria-label={`Dodaj: ${label}`}
      >
        +
      </button>
    </section>
  )
}

function GramsInput({ value, onChange }: { value: number; onChange: (grams: number) => void }) {
  return (
    <label className="flex w-20 shrink-0 items-center rounded-lg border border-stone-200 bg-white px-2 py-2 focus-within:border-brand">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full min-w-0 outline-none"
      />
      <span className="text-sm text-stone-400">g</span>
    </label>
  )
}

function RemoveButton({ onClick, hidden }: { onClick: () => void; hidden?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`size-8 shrink-0 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 ${hidden ? 'invisible' : ''}`}
      aria-label="Usuń"
    >
      ✕
    </button>
  )
}
