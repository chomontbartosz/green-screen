// Przełącznik trybu podstawowy / eksperta (opisy trybów: config/texts.ts).

import { MODES } from '../config/texts'
import { useStore } from '../data/store'
import type { Mode } from '../types'

export function ModeSwitch() {
  const { mode, save } = useStore()

  return (
    <div className="flex justify-center gap-1 text-xs">
      {(Object.keys(MODES) as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => save({ settings: { mode: m } })}
          title={MODES[m].description}
          className={`rounded-full px-3 py-1 ${m === mode ? 'bg-stone-200 font-medium text-stone-700' : 'text-stone-400 hover:text-stone-600'}`}
        >
          {MODES[m].label}
        </button>
      ))}
    </div>
  )
}
