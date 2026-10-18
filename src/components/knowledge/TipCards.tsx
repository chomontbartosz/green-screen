// Karty z poradami (ikona, tytuł, tekst) — wspólne dla ekranów Bazy wiedzy.

type Tip = { icon: string; title: string; text: string }

export function TipCards({ tips }: { tips: Tip[] }) {
  return (
    <div className="space-y-2">
      {tips.map((tip) => (
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
