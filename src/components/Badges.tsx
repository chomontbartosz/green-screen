// Seria dni (zmienia się codziennie) i odznaki: wielokrotne z licznikiem ×N, od ostatnio zdobytej. Zasady: config/achievements.ts.

import { Flame, Trophy } from 'lucide-react'
import { badgeStatus, STREAK, streakLength } from '../config/achievements'
import { useStore } from '../data/store'
import { fromKey } from '../lib/date'

export function Badges({ today }: { today: string }) {
  const { db, mode } = useStore()
  const streak = streakLength(db.days, today)
  const badges = badgeStatus(db.days, mode)
  const earned = badges.filter((b) => b.count > 0)

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
          <p className="text-xs text-stone-500">Każdy dzień z co najmniej {STREAK.minEntries} wpisem przedłuża serię. Nie przerwij jej!</p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <header className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Trophy className="size-5 text-amber-500" aria-hidden /> Odznaki
          </h2>
          <span className="text-sm text-stone-500">
            {earned.length} / {badges.length} zdobyte
          </span>
        </header>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {badges.map((badge) => {
            const has = badge.count > 0
            const last = badge.last && fromKey(badge.last).toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' })
            return (
              <li
                key={badge.name}
                title={last ? `${badge.description} · ostatnio ${last}` : badge.description}
                className={`relative rounded-xl p-2 text-center ${has ? 'bg-brand-soft' : 'bg-stone-50 opacity-50 grayscale'}`}
              >
                {badge.level && (
                  <span className="absolute top-1 left-1 rounded-full bg-amber-100 px-1.5 text-[10px] font-bold text-amber-800" title={`Poziom ${badge.level}`}>
                    {'★'.repeat(badge.level)}
                  </span>
                )}
                {badge.repeatable && badge.count > 1 && (
                  <span className="absolute top-1 right-1 rounded-full bg-black px-1.5 text-[10px] font-bold text-white">×{badge.count}</span>
                )}
                <span className="mt-2 block text-2xl">{badge.icon}</span>
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
