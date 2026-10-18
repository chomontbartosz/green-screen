// Okno modalne na natywnym <dialog>: zamyka się krzyżykiem, klawiszem Esc albo kliknięciem w tło.

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

type Props = { open: boolean; onClose: () => void; label: string; children: ReactNode }

export function Modal({ open, onClose, label, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog?.open) dialog?.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // kliknięcie w tło
      className="m-auto max-h-[90dvh] w-[min(34rem,calc(100%-2rem))] animate-modal-in overflow-y-auto rounded-3xl bg-transparent p-0 backdrop:bg-black/50"
    >
      {open && (
        <div className="relative">
          <button
            onClick={onClose}
            aria-label="Zamknij"
            className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow hover:bg-white"
          >
            <X className="size-5" aria-hidden />
          </button>
          {children}
        </div>
      )}
    </dialog>
  )
}
