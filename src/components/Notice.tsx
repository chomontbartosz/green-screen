// Krótki komunikat na górze ekranu (np. „Adres e-mail potwierdzony”), znika sam po kilku sekundach.

import { X } from 'lucide-react'
import { useEffect } from 'react'

export function Notice({ text, onClose }: { text: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000)
    return () => clearTimeout(timer)
  }, [text]) // odliczanie od nowa tylko przy nowym komunikacie

  return (
    <p role="status" className="mb-4 flex animate-modal-in items-start justify-between gap-2 rounded-2xl bg-black p-4 text-sm text-white">
      {text}
      <button onClick={onClose} aria-label="Zamknij" className="shrink-0">
        <X className="size-4" aria-hidden />
      </button>
    </p>
  )
}
