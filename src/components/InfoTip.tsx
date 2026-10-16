// Ikonka „i” z dymkiem: tytuł, jedno zdanie i link do źródła. Otwiera się po najechaniu lub stuknięciu.
// Dymek zajmuje pełną szerokość najbliższego rodzica z klasą `relative` (np. akapitu), więc nie wychodzi poza ekran.

import { useRef, useState } from 'react'

type Props = { title: string; summary: string; source: { title: string; url: string } }

export function InfoTip({ title, summary, source }: Props) {
  const [open, setOpen] = useState(false)
  const pointer = useRef('mouse') // mysz: dymek na najechanie; dotyk: stuknięcie otwiera i zamyka

  return (
    <span
      className="inline-block align-middle"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={() => setOpen(pointer.current === 'mouse' ? true : !open)}
        aria-expanded={open}
        aria-label={title}
        className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white"
      >
        i
      </button>
      {open && (
        <span className="absolute inset-x-0 top-full z-30 mt-2 block rounded-2xl bg-white p-4 text-left text-sm font-normal text-stone-700 shadow-xl">
          <span className="block font-semibold text-stone-900">{title}</span>
          <span className="mt-1 block">{summary}</span>
          <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 block text-xs text-brand-ink underline">
            {source.title}
          </a>
        </span>
      )}
    </span>
  )
}
