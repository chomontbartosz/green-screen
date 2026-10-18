// Baza wiedzy → „Co się liczy, a co nie”: proste DO's i DON'Ts (teksty: config/knowledge.ts).

import { COUNTS } from '../../config/knowledge'

export function CountsGuide() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-600">{COUNTS.intro}</p>
      <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
        <h2 className="font-semibold text-amber-900">{COUNTS.callout.title}</h2>
        <p className="mt-1 text-sm text-amber-800">{COUNTS.callout.text}</p>
      </section>
      <List title="✅ Liczy się" items={COUNTS.yes} className="bg-brand-soft" />
      <List title="❌ Nie liczy się" items={COUNTS.no} className="bg-white" />
      <p className="text-xs text-stone-500">🥔 {COUNTS.potatoNote}</p>
    </div>
  )
}

function List({ title, items, className }: { title: string; items: string[]; className: string }) {
  return (
    <section className={`rounded-2xl p-4 shadow-sm ${className}`}>
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
