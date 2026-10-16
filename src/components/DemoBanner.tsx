// Baner na ekranie „Dziś” przy pierwszym uruchomieniu: propozycja importu danych demo (teksty: config/texts.ts).
// Podgląd w dowolnym momencie: ?demo w adresie.

import { useState } from 'react'
import { DEMO } from '../config/texts'
import { generateDemoDays } from '../data/demo'
import { useStore } from '../data/store'
import { TEST } from '../lib/testParams'

export function DemoBanner({ today, onImported }: { today: string; onImported: () => void }) {
  const { db, mode, save } = useStore()
  const [hidden, setHidden] = useState(false)
  if (hidden || (db.settings.demoOffered && !TEST.demo)) return null

  const accept = () => {
    save({ days: generateDemoDays(today, mode, db.days), settings: { demoOffered: true } })
    setHidden(true)
    onImported()
  }

  return (
    <section className="rounded-2xl border-2 border-brand bg-brand-soft p-4">
      <h2 className="text-lg font-semibold text-brand-ink">{DEMO.question}</h2>
      <p className="mt-1 text-sm text-brand-ink">{DEMO.text}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={accept} className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-black hover:bg-brand-dark">
          {DEMO.accept}
        </button>
        <button
          onClick={() => {
            save({ settings: { demoOffered: true } })
            setHidden(true)
          }}
          className="rounded-full px-4 py-2 text-sm text-brand-ink hover:bg-brand-soft"
        >
          {DEMO.decline}
        </button>
      </div>
    </section>
  )
}
