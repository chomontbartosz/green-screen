// Wyróżniona ramka z zastrzeżeniem (np. „Szacunki, nie diagnoza”).

export function Disclaimer({ title, text }: { title: string; text: string | string[] }) {
  return (
    <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
      <h2 className="font-semibold text-amber-900">{title}</h2>
      {[text].flat().map((paragraph) => (
        <p key={paragraph} className="mt-1 text-sm text-amber-900">
          {paragraph}
        </p>
      ))}
    </section>
  )
}
