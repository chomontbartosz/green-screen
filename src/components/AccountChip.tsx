// Konto w nagłówku: gość widzi swoją losową nazwę i „Zaloguj”, zalogowany — e-mail i „Wyloguj”.

import { UserRound } from 'lucide-react'
import { useStore } from '../data/store'
import type { AuthMode } from './AuthModal'

export function AccountChip({ onOpen }: { onOpen: (mode: AuthMode) => void }) {
  const { user, guestName, logout } = useStore()

  return (
    <div className="flex min-w-0 items-center gap-2 text-xs">
      <span className="flex min-w-0 items-center gap-1 text-stone-500">
        <UserRound className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{user ? user.email : guestName}</span>
      </span>
      <button
        onClick={() => (user ? logout() : onOpen('login'))}
        className="shrink-0 rounded-full bg-white px-3 py-1 font-semibold text-stone-700 shadow-sm hover:bg-stone-100"
      >
        {user ? 'Wyloguj' : 'Zaloguj'}
      </button>
    </div>
  )
}
