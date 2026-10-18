// Baza wiedzy → „Jak przechowywać i przygotowywać” (teksty: config/knowledge.ts).

import { STORAGE } from '../../config/knowledge'

export function StorageGuide() {
  return (
    <div className="space-y-2">
      {STORAGE.map((tip) => (
        <article key={tip.title} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <span className="text-2xl">{tip.icon}</span>
          <div>
            <h2 className="font-semibold">{tip.title}</h2>
            <p className="text-sm text-stone-600">{tip.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
