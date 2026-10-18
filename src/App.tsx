// Główny układ: intro przy pierwszym uruchomieniu (lub z ?intro w adresie), potem nagłówek, ekran i dolny pasek.
// Dolny pasek: 2 zakładki z lewej, czarny „+” na środku (przejście do „Dziś”), 2 zakładki z prawej.

import { BookOpen, CalendarDays, House, Plus, Trophy } from 'lucide-react'
import { useState } from 'react'
import { AccountChip } from './components/AccountChip'
import { AuthModal, type AuthMode } from './components/AuthModal'
import { ModeSwitch } from './components/ModeSwitch'
import { Notice } from './components/Notice'
import { ACCOUNT, APP_NAME, TAGLINE } from './config/texts'
import { useStore } from './data/store'
import { useClock } from './hooks/useClock'
import { LINK } from './lib/linkParams'
import { TEST } from './lib/testParams'
import { BadgesPage } from './pages/BadgesPage'
import { CalendarPage } from './pages/CalendarPage'
import { IntroPage } from './pages/IntroPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { StartPage } from './pages/StartPage'
import { TodayPage } from './pages/TodayPage'

const TABS = {
  start: { label: 'Start', Icon: House },
  calendar: { label: 'Kalendarz', Icon: CalendarDays },
  badges: { label: 'Odznaki', Icon: Trophy },
  knowledge: { label: 'Baza wiedzy', Icon: BookOpen },
} as const
type BarTab = keyof typeof TABS
type Tab = BarTab | 'today' // „Dziś” nie ma własnej zakładki — otwiera go „+”

const LEFT: BarTab[] = ['start', 'calendar']
const RIGHT: BarTab[] = ['badges', 'knowledge']

export default function App() {
  const { db } = useStore()
  const [tab, setTab] = useState<Tab>('start')
  const [introForced, setIntroForced] = useState(TEST.intro)
  const [authMode, setAuthMode] = useState<AuthMode | null>(LINK.resetToken ? 'reset' : null)
  const [notice, setNotice] = useState(LINK.verified === '1' ? ACCOUNT.verified : LINK.verified === '0' ? ACCOUNT.verifyFailed : '')
  const { now, today } = useClock()

  const authModal = (
    <AuthModal
      mode={authMode}
      resetToken={LINK.resetToken}
      onMode={setAuthMode}
      onDone={(message) => {
        setAuthMode(null)
        setNotice(message)
        setIntroForced(false)
      }}
    />
  )

  if (!db.settings.mode || introForced)
    return (
      <>
        <IntroPage onDone={() => setIntroForced(false)} onLogin={() => setAuthMode('login')} />
        {authModal}
      </>
    )

  const open = (t: Tab) => {
    setTab(t)
    window.scrollTo(0, 0)
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-32 text-stone-800">
      <header className="sticky top-0 z-20 -mx-4 mb-4 flex items-center justify-between gap-3 bg-stone-50/90 px-4 py-3 backdrop-blur">
        <div className="shrink-0">
          <span className="block text-lg leading-tight font-extrabold">{APP_NAME}</span>
          <span className="block text-xs text-stone-500">{TAGLINE}</span>
        </div>
        <AccountChip onOpen={setAuthMode} />
      </header>

      {notice && <Notice text={notice} onClose={() => setNotice('')} />}
      {authModal}

      {tab === 'start' && <StartPage today={today} onAddToday={() => open('today')} onAccount={setAuthMode} />}
      {tab === 'today' && <TodayPage today={today} now={now} onAccount={setAuthMode} />}
      {tab === 'calendar' && <CalendarPage today={today} />}
      {tab === 'badges' && <BadgesPage today={today} />}
      {tab === 'knowledge' && <KnowledgePage />}

      <footer className="mt-8">
        <ModeSwitch />
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {LEFT.map((t) => (
            <TabButton key={t} tab={t} active={tab === t} onClick={() => open(t)} />
          ))}
          <div className="relative flex justify-center">
            <button
              onClick={() => open('today')}
              aria-label="Dodaj do dziś"
              aria-current={tab === 'today' ? 'page' : undefined}
              className={`absolute -top-6 flex size-15 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.25)] ring-[5px] ring-white transition hover:scale-105 active:scale-95 ${
                tab === 'today' ? 'bg-brand text-black' : 'bg-black text-white'
              }`}
            >
              <Plus className="size-8" strokeWidth={2.6} aria-hidden />
            </button>
          </div>
          {RIGHT.map((t) => (
            <TabButton key={t} tab={t} active={tab === t} onClick={() => open(t)} />
          ))}
        </div>
      </nav>
    </div>
  )
}

function TabButton({ tab, active, onClick }: { tab: BarTab; active: boolean; onClick: () => void }) {
  const { label, Icon } = TABS[tab]
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative flex flex-col items-center gap-0.5 py-2 text-[11px] ${active ? 'font-semibold text-black' : 'text-stone-500'}`}
    >
      {active && <span className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-brand" />}
      <Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} aria-hidden />
      {label}
    </button>
  )
}
