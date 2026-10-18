// Lista rozwijana z wyszukiwaniem: klikasz i wybierasz albo wpisujesz kilka liter, żeby zawęzić listę.
// Jeśli wpisanej nazwy nie ma na liście, na końcu pojawia się opcja „+ Dodaj …” (własna pozycja).
// Własne pozycje mają na liście „×” (albo klawisz Delete), które usuwa je z listy wyboru.

import { useState, type KeyboardEvent } from 'react'

type Props = {
  options: string[]
  value: string
  placeholder: string
  onSelect: (name: string) => void
  removable?: string[] // pozycje, które można usunąć z listy (własne)
  onRemoveOption?: (name: string) => void
  autoFocus?: boolean
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function ProduceSelect({ options, value, placeholder, onSelect, removable = [], onRemoveOption, autoFocus }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const q = query.trim().toLowerCase()
  const matches = options.filter((o) => o.toLowerCase().includes(q))
  const newName = q && !options.some((o) => o.toLowerCase() === q) ? capitalize(query.trim()) : null
  const choices = newName ? [...matches, newName] : matches

  const pick = (name: string) => {
    onSelect(name)
    setOpen(false)
    setQuery('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') setActive((i) => Math.min(i + 1, choices.length - 1))
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0))
    else if (e.key === 'Enter' && choices[active]) pick(choices[active])
    else if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'Delete' && removable.includes(choices[active])) onRemoveOption?.(choices[active])
    else return
    e.preventDefault()
  }

  return (
    <div className="relative min-w-0 flex-1">
      <input
        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 outline-none focus:border-brand"
        autoFocus={autoFocus}
        value={open ? query : value}
        placeholder={open && value ? value : placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      {open && choices.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-stone-200 bg-white py-1 text-sm shadow-lg">
          {choices.map((name, i) => (
            <li
              key={name}
              className={`flex cursor-pointer items-center justify-between px-3 py-1.5 ${i === active ? 'bg-brand-soft text-brand-ink' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault() // nie zamykaj listy przed wyborem
                pick(name)
              }}
              onMouseEnter={() => setActive(i)}
            >
              {name === newName ? `+ Dodaj „${name}”` : name}
              {removable.includes(name) && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation() // nie wybieraj pozycji, tylko ją usuń
                    onRemoveOption?.(name)
                  }}
                  title="Usuń własną pozycję z listy"
                  aria-label={`Usuń ${name} z listy`}
                  className="ml-2 rounded-full px-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
