// Strona „Dziś”: przypomnienie, podpowiedzi z ostatnich dni, edycja dzisiejszych porcji i odkrycia dnia.
// O północy przełącza się na nowy, pusty dzień.

import { AccountBanner } from '../components/AccountBanner'
import type { AuthMode } from '../components/AuthModal'
import { BalanceTips } from '../components/BalanceTips'
import { DayEditor } from '../components/DayEditor'
import { DiscoverCard } from '../components/DiscoverCard'
import { Reminder } from '../components/Reminder'
import { StreakChip } from '../components/StreakChip'
import { useStore } from '../data/store'
import { formatLong } from '../lib/date'

type Props = { today: string; now: Date; onAccount: (mode: AuthMode) => void }

export function TodayPage({ today, now, onAccount }: Props) {
  const { dayOf, updateDay } = useStore()

  return (
    <div className="space-y-4">
      <AccountBanner today={today} onOpen={onAccount} />
      <Reminder day={dayOf(today)} now={now} />
      <BalanceTips today={today} />
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold first-letter:uppercase">{formatLong(today)}</h1>
        <StreakChip today={today} />
      </header>
      <DayEditor key={today} day={dayOf(today)} onChange={(day) => updateDay(today, day)} />
      <DiscoverCard today={today} />
    </div>
  )
}
