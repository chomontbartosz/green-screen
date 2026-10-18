// Baza wiedzy → „Nasze podejście vs dieta”: porównanie w punktach (teksty: config/knowledge.ts).

import { APPROACH } from '../../config/knowledge'
import { APP_NAME } from '../../config/texts'

export function ApproachGuide() {
  return (
    <div className="space-y-3">
      <p className="text-base font-semibold">{APPROACH.intro}</p>
      {APPROACH.rows.map((row) => (
        <article key={row.topic} className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-xs font-semibold tracking-wide text-stone-400 uppercase">{row.topic}</h2>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <p className="rounded-xl bg-stone-100 p-2 text-stone-600">
              <span className="block text-[11px] font-semibold text-stone-400">Typowa dieta</span>
              {row.diet}
            </p>
            <p className="rounded-xl bg-brand-soft p-2 text-stone-800">
              <span className="block text-[11px] font-semibold text-brand-ink">{APP_NAME}</span>
              {row.ours}
            </p>
          </div>
        </article>
      ))}
      <p className="text-xs text-stone-500">{APPROACH.note}</p>
    </div>
  )
}
