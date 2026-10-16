// Strona „Dziś”: przypomnienie, podpowiedzi z ostatnich dni, edycja dzisiejszych porcji, odkrycie dnia i sezon.
// O północy przełącza się na nowy, pusty dzień.

import { BalanceTips } from '../components/BalanceTips'
import { DayEditor } from '../components/DayEditor'
import { DemoBanner } from '../components/DemoBanner'
import { DiscoverCard } from '../components/DiscoverCard'
import { Reminder } from '../components/Reminder'
import { SeasonCard } from '../components/SeasonCard'
import { StreakChip } from '../components/StreakChip'
import { useStore } from '../data/store'
import { formatLong } from '../lib/date'

type Props = { today: string; now: Date; onDemoImported: () => void }

export function TodayPage({ today, now, onDemoImported }: Props) {
  const { dayOf, updateDay } = useStore()

  return (
    <div className="space-y-4">
      <DemoBanner today={today} onImported={onDemoImported} />
      <Reminder day={dayOf(today)} now={now} />
      <BalanceTips today={today} />
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold first-letter:uppercase">{formatLong(today)}</h1>
        <StreakChip today={today} />
      </header>
      <DayEditor key={today} day={dayOf(today)} onChange={(day) => updateDay(today, day)} />
      <DiscoverCard today={today} />
      <SeasonCard today={today} />
    </div>
  )
}
