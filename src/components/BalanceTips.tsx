// Podpowiedzi „jedz kolorowo” na podstawie ostatnich 7 dni (zasady i źródła: config/balance.ts).

import { checkBalance } from '../config/balance'
import { useStore } from '../data/store'

export function BalanceTips({ today }: { today: string }) {
  const { db, mode } = useStore()
  const tips = checkBalance(db.days, today, mode)
  if (tips.length === 0) return null

  return (
    <section className="space-y-2">
      {tips.map((tip) => (
        <div key={tip.title} className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="font-semibold">💡 {tip.title}</h2>
          <p className="mt-1 text-sm text-stone-600">{tip.text}</p>
          {tip.suggestions.length > 0 && <p className="mt-1 text-xs text-stone-400">Np. {tip.suggestions.join(', ')}</p>}
        </div>
      ))}
    </section>
  )
}
