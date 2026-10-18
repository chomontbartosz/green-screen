// Strona „Start” (pierwszy ekran): wykresy witamin i minerałów z 7 dni, dzisiejszy postęp z przejściem do „Dziś”, tabela dni.

import { AccountBanner } from '../components/AccountBanner'
import type { AuthMode } from '../components/AuthModal'
import { DaysTable } from '../components/DaysTable'
import { DemoBanner } from '../components/DemoBanner'
import { NutrientRings } from '../components/NutrientRings'
import { TodayProgress } from '../components/TodayProgress'
import { CHARTS, NUTRITION, nutrientCoverage, type Chart } from '../config/nutrients'
import { useStore } from '../data/store'

type Props = { today: string; onAddToday: () => void; onAccount: (mode: AuthMode) => void }

export function StartPage({ today, onAddToday, onAccount }: Props) {
  const { db, mode } = useStore()
  const coverage = nutrientCoverage(db.days, today, mode)

  return (
    <div className="space-y-4">
      <DemoBanner today={today} onImported={() => window.scrollTo(0, 0)} />
      <AccountBanner today={today} onOpen={onAccount} />
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="font-semibold">Składniki z ostatnich {NUTRITION.windowDays} dni</h2>
        <p className="text-xs text-stone-500">
          Każdy pierścień to kolejny krok do pełnego tygodnia 5 + 5. Najedź lub stuknij, żeby zobaczyć, co jeść.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(Object.keys(CHARTS) as Chart[]).map((chart) => (
            <NutrientRings key={chart} chart={chart} coverage={coverage} />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-stone-400">
          Szacunek orientacyjny, nie pomiar.{' '}
          <a href={NUTRITION.source.url} target="_blank" rel="noreferrer" className="underline">
            Normy: {NUTRITION.source.title}
          </a>
        </p>
      </section>
      <TodayProgress today={today} onAdd={onAddToday} />
      <DaysTable today={today} />
    </div>
  )
}
