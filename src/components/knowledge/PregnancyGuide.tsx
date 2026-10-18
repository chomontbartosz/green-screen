// Baza wiedzy → „Kobieta w ciąży”: na co zwrócić uwagę przy warzywach i owocach (teksty i źródła: config/knowledge.ts).

import { PREGNANCY } from '../../config/knowledge'
import { Disclaimer } from './Disclaimer'
import { TipCards } from './TipCards'

export function PregnancyGuide() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-stone-600">{PREGNANCY.intro}</p>
      <TipCards tips={PREGNANCY.tips} />
      <Disclaimer title="⚠️ Ważne" text={PREGNANCY.note} />
      <p className="text-[11px] text-stone-400">
        Źródła:{' '}
        {PREGNANCY.sources.map((source, i) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="underline">
            {i > 0 && ', '}
            {source.title}
          </a>
        ))}
      </p>
    </div>
  )
}
