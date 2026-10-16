// Licznik serii dni z rzędu (zasada serii: config/achievements.ts).

import { STREAK, streakLength } from '../config/achievements'
import { useStore } from '../data/store'

export function StreakChip({ today }: { today: string }) {
  const { db, mode } = useStore()
  const streak = streakLength(db.days, today, mode)
  if (streak === 0) return null

  return (
    <span title={`Dni z rzędu z wynikiem od ${STREAK.minScore} pkt`} className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-900">
      🔥 {streak} {streak === 1 ? 'dzień' : 'dni'} z rzędu
    </span>
  )
}
