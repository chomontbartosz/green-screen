// Zielona karta „Jak to działa?” — w oknie na ekranie „Dziś” i w Bazie wiedzy (treść: HowItWorks).

import { INTRO } from '../config/texts'
import { HowItWorks } from './HowItWorks'

export function HowItWorksCard() {
  return (
    <section className="rounded-3xl bg-brand p-5 text-black">
      <h1 className="mb-4 pr-10 text-3xl leading-tight font-extrabold">{INTRO.headline}</h1>
      <HowItWorks />
    </section>
  )
}
