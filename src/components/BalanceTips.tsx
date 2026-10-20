// Podpowiedzi „jedz kolorowo” na podstawie ostatnich 7 dni (zasady i źródła: config/balance.ts).
// Jedna karta, w niej wiersz na każdy brak: kropka w brakującym kolorze (albo koszyk przy różnorodności),
// tekst i przykładowe produkty. Ile wierszy naraz — BALANCE.maxTips.

import { COLORS, checkBalance } from '../config/balance'
import { useStore } from '../data/store'
import { ProduceIcon } from './ProduceIcon'

export function BalanceTips({ today }: { today: string }) {
  const { db, mode } = useStore()
  const tips = checkBalance(db.days, today, mode)
  if (tips.length === 0) return null

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-stone-500">Uzupełnij w tym tygodniu</h2>
      <ul className="mt-2 divide-y divide-stone-100">
        {tips.map((tip) => (
          <li key={tip.title} className="py-3 first:pt-1 last:pb-0">
            <h3 className="flex items-center gap-2 font-semibold">
              {tip.color ? <span className={`size-4 shrink-0 rounded-full ${COLORS[tip.color].swatch}`} aria-hidden /> : <span aria-hidden>🧺</span>}
              {tip.title}
            </h3>
            <p className="mt-1 text-sm text-stone-600">{tip.text}</p>
            {tip.suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <span className="mr-1 text-xs text-stone-400">Np.</span>
                {tip.suggestions.map(({ group, name }) => (
                  <ProduceIcon key={name} group={group} name={name} size="size-8" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
