// Baza wiedzy → „Mity i fakty” (teksty: config/knowledge.ts).

import { MYTHS } from '../../config/knowledge'

export function MythsGuide() {
  return (
    <div className="space-y-2">
      {MYTHS.map(({ myth, fact }) => (
        <article key={myth} className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-stone-500 line-through decoration-red-400">❌ {myth}</p>
          <p className="mt-1 text-sm text-stone-800">✅ {fact}</p>
        </article>
      ))}
    </div>
  )
}
