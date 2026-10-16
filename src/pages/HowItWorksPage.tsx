// Zakładka „Jak to działa?” — ta sama treść co na ekranie intro, dostępna w każdej chwili.

import { HowItWorks } from '../components/HowItWorks'
import { INTRO } from '../config/texts'

export function HowItWorksPage() {
  return (
    <section className="rounded-2xl bg-brand p-5 text-black">
      <h1 className="mb-4 text-3xl leading-tight font-extrabold">{INTRO.headline}</h1>
      <HowItWorks />
    </section>
  )
}
