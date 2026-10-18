// Ikona owocu/warzywa. Po najechaniu (lub stuknięciu na telefonie) pokazuje dymek ze szczegółami.
// Własne pozycje użytkownika dostają szarą ikonkę z pierwszą literą nazwy.

import { useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { findProduce } from '../config/produce'
import type { Group } from '../types'
import { ProduceTooltip } from './ProduceTooltip'

type Props = { group: Group; name: string; size?: string }

export function ProduceIcon({ group, name, size = 'size-10' }: Props) {
  const [anchor, setAnchor] = useState<DOMRect | null>(null)
  const show = (e: MouseEvent) => setAnchor(e.currentTarget.getBoundingClientRect())

  return (
    <>
      <span onMouseEnter={show} onMouseLeave={() => setAnchor(null)} onClick={show} className="inline-flex cursor-help">
        <ProduceImage group={group} name={name} size={size} />
      </span>
      {anchor && createPortal(<ProduceTooltip group={group} name={name} anchor={anchor} />, document.body)}
    </>
  )
}

/** Sam obrazek, bez dymka. Pliki w ikonki/ mają duży margines, więc obraz jest powiększony i przycięty.
 * Własna pozycja albo brak pliku ikony → szare kółko z pierwszą literą. */
export function ProduceImage({ group, name, size }: Required<Props>) {
  const produce = findProduce(group, name)
  const [missing, setMissing] = useState(false)

  if (!produce || missing) {
    return (
      <span className={`${size} @container inline-flex shrink-0 items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-500`}>
        <span className="text-[45cqw]">{name.charAt(0).toUpperCase()}</span>
      </span>
    )
  }
  return (
    <span className={`${size} inline-block shrink-0 overflow-hidden rounded-full bg-white`}>
      <img src={`/${produce.icon}`} alt={name} onError={() => setMissing(true)} className="size-full scale-[4.2] object-contain" />
    </span>
  )
}
