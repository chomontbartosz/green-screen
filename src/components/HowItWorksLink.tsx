// Dyskretny link „Jak to działa?” obok zielonego „+”: kto dodaje, nie zauważy; kto szuka pomocy, znajdzie.
// Otwiera okno z zasadami aplikacji.

import { useState } from 'react'
import { INTRO } from '../config/texts'
import { HowItWorksCard } from './HowItWorksCard'
import { Modal } from './Modal'

export function HowItWorksLink() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-stone-400 underline underline-offset-2 hover:text-stone-600">
        {INTRO.howTitle}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={INTRO.howTitle}>
        <HowItWorksCard />
      </Modal>
    </>
  )
}
