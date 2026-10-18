// Strona „Baza wiedzy”: lista tematów → osobny ekran każdego tematu ze strzałką powrotu.
// Nowy temat dodasz jednym wpisem w SCREENS (treści tekstowe: config/knowledge.ts).

import { ArrowLeft, Baby, Carrot, ChevronRight, CircleCheck, CircleHelp, CookingPot, Lightbulb, Palette, Pill, Scale } from 'lucide-react'
import { useState } from 'react'
import { HowItWorksCard } from '../components/HowItWorksCard'
import { ApproachGuide } from '../components/knowledge/ApproachGuide'
import { ColorsGuide } from '../components/knowledge/ColorsGuide'
import { CountsGuide } from '../components/knowledge/CountsGuide'
import { MythsGuide } from '../components/knowledge/MythsGuide'
import { NutrientsGuide } from '../components/knowledge/NutrientsGuide'
import { PregnancyGuide } from '../components/knowledge/PregnancyGuide'
import { StorageGuide } from '../components/knowledge/StorageGuide'
import { ProduceCatalog } from '../components/ProduceCatalog'

const SCREENS = {
  produce: { title: 'Warzywa i owoce', description: 'Wszystkie produkty: składniki, kolor i sezon', Icon: Carrot, Content: ProduceCatalog },
  counts: { title: 'Co się liczy, a co nie', description: 'Ketchup, frytki, plasterek cytryny w herbacie…', Icon: CircleCheck, Content: CountsGuide },
  colors: { title: 'Kolory warzyw i owoców', description: '5 grup kolorów i co dają organizmowi', Icon: Palette, Content: ColorsGuide },
  nutrients: { title: 'Witaminy i minerały', description: 'Do czego służą i gdzie ich najwięcej', Icon: Pill, Content: NutrientsGuide },
  storage: { title: 'Jak przechowywać i przygotowywać', description: 'Żeby nie tracić witamin i smaku', Icon: CookingPot, Content: StorageGuide },
  myths: { title: 'Mity i fakty', description: 'Owoce tuczą? Mrożonki są gorsze?', Icon: CircleHelp, Content: MythsGuide },
  pregnancy: { title: 'Kobieta w ciąży', description: 'Foliany, bezpieczne mycie, czego unikać', Icon: Baby, Content: PregnancyGuide },
  approach: { title: 'Nasze podejście vs dieta', description: 'Dlaczego nawyk zamiast liczenia kalorii', Icon: Scale, Content: ApproachGuide },
  how: { title: 'Jak to działa?', description: 'Zasada 5 + 5, kolory i porcja', Icon: Lightbulb, Content: HowItWorksCard },
}
type Screen = keyof typeof SCREENS

export function KnowledgePage() {
  const [screen, setScreen] = useState<Screen | null>(null)

  const open = (s: Screen | null) => {
    setScreen(s)
    window.scrollTo(0, 0)
  }

  if (screen) {
    const { title, Content } = SCREENS[screen]
    return (
      <div className="space-y-4">
        <header className="flex items-center gap-2">
          <button onClick={() => open(null)} aria-label="Wróć do Bazy wiedzy" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm hover:bg-stone-100">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <h1 className="text-xl font-extrabold">{title}</h1>
        </header>
        <Content />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h1 className="mb-3 text-xl font-extrabold">Baza wiedzy</h1>
      {(Object.keys(SCREENS) as Screen[]).map((s) => {
        const { title, description, Icon } = SCREENS[s]
        return (
          <button key={s} onClick={() => open(s)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm hover:bg-stone-50">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{title}</span>
              <span className="block text-xs text-stone-500">{description}</span>
            </span>
            <ChevronRight className="size-5 text-stone-400" aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
