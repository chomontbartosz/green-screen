// Główny układ: intro przy pierwszym uruchomieniu (lub z ?intro w adresie), potem nagłówek, ekran i dolny pasek zakładek.

import { CalendarDays, ChartPie, Lightbulb, Salad } from 'lucide-react'
import { useState } from 'react'
import { ModeSwitch } from './components/ModeSwitch'
import { APP_NAME, TAGLINE } from './config/texts'
import { useStore } from './data/store'
import { useClock } from './hooks/useClock'
import { TEST } from './lib/testParams'
import { CalendarPage } from './pages/CalendarPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { IntroPage } from './pages/IntroPage'
import { SummaryPage } from './pages/SummaryPage'
import { TodayPage } from './pages/TodayPage'

const TABS = {
  today: { label: 'Dziś', Icon: Salad },
  calendar: { label: 'Kalendarz', Icon: CalendarDays },
  summary: { label: 'Podsumowanie', Icon: ChartPie },
  how: { label: 'Jak to działa?', Icon: Lightbulb },
} as const
type Tab = keyof typeof TABS

export default function App() {
  const { db } = useStore()
  const [tab, setTab] = useState<Tab>('today')
  const [introForced, setIntroForced] = useState(TEST.intro)
  const { now, today } = useClock()

  if (!db.settings.mode || introForced) return <IntroPage onDone={() => setIntroForced(false)} />

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 text-stone-800">
      <header className="sticky top-0 z-20 -mx-4 mb-4 bg-stone-50/90 px-4 py-3 backdrop-blur">
        <span className="block text-lg leading-tight font-extrabold">{APP_NAME}</span>
        <span className="block text-xs text-stone-500">{TAGLINE}</span>
      </header>

      {tab === 'today' && <TodayPage today={today} now={now} onDemoImported={() => setTab('summary')} />}
      {tab === 'calendar' && <CalendarPage today={today} />}
      {tab === 'summary' && <SummaryPage today={today} />}
      {tab === 'how' && <HowItWorksPage />}

      <footer className="mt-8">
        <ModeSwitch />
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {(Object.keys(TABS) as Tab[]).map((t) => {
            const { label, Icon } = TABS[t]
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                aria-current={tab === t ? 'page' : undefined}
                className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] ${tab === t ? 'font-semibold text-black' : 'text-stone-500'}`}
              >
                {tab === t && <span className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-brand" />}
                <Icon className="size-6" strokeWidth={tab === t ? 2.4 : 1.8} aria-hidden />
                {label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
