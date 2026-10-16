// Seria dni (zmienia się codziennie) i odznaki (zdobywa się raz na zawsze). Zasady: config/achievements.ts.

import { Flame, Trophy } from 'lucide-react'
import { BADGES, STREAK, streakLength } from '../config/achievements'
import { useStore } from '../data/store'

export function Badges({ today }: { today: string }) {
  const { db, mode } = useStore()
  const streak = streakLength(db.days, today, mode)
  const earned = BADGES.filter((badge) => badge.earned(db.days, mode))

  return (
    <>
      <section className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <span className="flex size-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <Flame className="size-7" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            Seria: {streak} {streak === 1 ? 'dzień' : 'dni'} z rzędu
          </h2>
          <p className="text-xs text-stone-500">Dzień liczy się do serii od {STREAK.minScore} pkt. Nie przerwij jej!</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <header className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Trophy className="size-5 text-amber-500" aria-hidden /> Odznaki
          </h2>
          <span className="text-sm text-stone-500">
            {earned.length} / {BADGES.length} zdobyte
          </span>
        </header>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {BADGES.map((badge) => {
            const has = earned.includes(badge)
            return (
              <li key={badge.name} title={badge.description} className={`rounded-xl p-2 text-center ${has ? 'bg-brand-soft' : 'bg-stone-50 opacity-50 grayscale'}`}>
                <span className="block text-2xl">{badge.icon}</span>
                <span className="block text-xs font-semibold">{badge.name}</span>
                <span className="block text-[10px] leading-tight text-stone-500">{badge.description}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
