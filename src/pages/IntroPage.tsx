// Ekran intro przy pierwszym uruchomieniu (lub z ?intro w adresie): nazwa, hasło, „Jak to działa?” i wybór trybu.

import { HowItWorks } from '../components/HowItWorks'
import { APP_NAME, INTRO, MODES, TAGLINE } from '../config/texts'
import { useStore } from '../data/store'
import type { Mode } from '../types'

export function IntroPage({ onDone }: { onDone: () => void }) {
  const { save } = useStore()

  return (
    <div className="min-h-dvh bg-brand text-black">
      <div className="mx-auto max-w-lg px-5 py-10">
        <div className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
          <p className="text-2xl font-extrabold tracking-wide uppercase">{APP_NAME}</p>
          <p className="text-base font-semibold">{TAGLINE}</p>
        </div>
        <h1 className="mt-6 text-4xl leading-tight font-extrabold">{INTRO.headline}</h1>

        <div className="mt-6">
          <HowItWorks />
        </div>

        <h2 className="mt-10 text-2xl font-extrabold">{INTRO.chooseMode}</h2>
        <div className="mt-3 grid gap-3">
          {(Object.keys(MODES) as Mode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                save({ settings: { mode } })
                onDone()
              }}
              className="rounded-2xl bg-black p-4 text-left text-white transition hover:scale-[1.02]"
            >
              <span className="block text-lg font-extrabold">{MODES[mode].label} →</span>
              <span className="block text-sm text-stone-300">{MODES[mode].description}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold">Tryb możesz zmienić w każdej chwili na dole ekranu.</p>
      </div>
    </div>
  )
}
