// Edycja jednego dnia: wynik + grupy Warzywa i Owoce. Używane na stronie „Dziś” i w kalendarzu.

import { GROUP_ORDER } from '../config/produce'
import type { DayEntry } from '../types'
import { GroupSection } from './GroupSection'
import { ScoreCard } from './ScoreCard'

type Props = { day: DayEntry; onChange: (day: DayEntry) => void }

export function DayEditor({ day, onChange }: Props) {
  return (
    <div className="space-y-4">
      <ScoreCard day={day} />
      {GROUP_ORDER.map((group) => (
        <GroupSection key={group} group={group} items={day[group]} onChange={(items) => onChange({ ...day, [group]: items })} />
      ))}
    </div>
  )
}
