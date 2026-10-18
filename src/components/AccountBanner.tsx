// Przypomnienie o koncie dla gościa: pojawia się po dodaniu pierwszego produktu, raz dziennie, z „×” do zamknięcia.
// Dzień zamknięcia pamięta przeglądarka (to tylko wygoda, nie dane).

import { X } from 'lucide-react'
import { useState } from 'react'
import { ACCOUNT } from '../config/texts'
import { useStore } from '../data/store'
import type { AuthMode } from './AuthModal'

const DISMISS_KEY = 'green-screen-account-banner'

const dismissedOn = () => {
  try {
    return localStorage.getItem(DISMISS_KEY)
  } catch {
    return null
  }
}

type Props = { today: string; onOpen: (mode: AuthMode) => void }

export function AccountBanner({ today, onOpen }: Props) {
  const { user, db } = useStore()
  const [closed, setClosed] = useState(dismissedOn() === today)
  if (user || closed || Object.keys(db.days).length === 0) return null

  const close = () => {
    try {
      localStorage.setItem(DISMISS_KEY, today)
    } catch {
      // bez pamięci — baner zamknie się tylko do odświeżenia strony
    }
    setClosed(true)
  }

  return (
    <section className="relative rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 pr-10">
      <button onClick={close} aria-label="Zamknij przypomnienie" className="absolute top-2 right-2 rounded-full p-1.5 text-sky-700 hover:bg-sky-100">
        <X className="size-4" aria-hidden />
      </button>
      <h2 className="font-semibold text-sky-950">{ACCOUNT.banner.title}</h2>
      <p className="mt-1 text-sm text-sky-900">{ACCOUNT.banner.text}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => onOpen('register')} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">
          {ACCOUNT.banner.register}
        </button>
        <button onClick={() => onOpen('login')} className="rounded-full px-4 py-2 text-sm text-sky-900 hover:bg-sky-100">
          {ACCOUNT.banner.login}
        </button>
      </div>
    </section>
  )
}
