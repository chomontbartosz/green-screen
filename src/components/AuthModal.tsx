// Okno konta: rejestracja (e-mail + hasło 2×), logowanie, „Nie pamiętam hasła” i ustawienie nowego hasła z linku.
// Teksty: config/texts.ts (ACCOUNT), zasady haseł: server/config.ts.

import { useState, type FormEvent } from 'react'
import { ACCOUNT } from '../config/texts'
import * as api from '../data/api'
import { useStore } from '../data/store'
import { Modal } from './Modal'

export type AuthMode = 'register' | 'login' | 'forgot' | 'reset'

type Props = { mode: AuthMode | null; resetToken?: string | null; onMode: (mode: AuthMode | null) => void; onDone: (message: string) => void }

export function AuthModal({ mode, resetToken, onMode, onDone }: Props) {
  const { register, login, resetPassword } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const switchTo = (next: AuthMode) => {
    setError('')
    setInfo('')
    setPassword('')
    setRepeat('')
    onMode(next)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if ((mode === 'register' || mode === 'reset') && password !== repeat) return setError(ACCOUNT.passwordsDiffer)
    setBusy(true)
    try {
      if (mode === 'register') {
        await register(email, password)
        onDone(ACCOUNT.registered)
      } else if (mode === 'login') {
        await login(email, password)
        onDone('')
      } else if (mode === 'forgot') {
        await api.forgotPassword(email)
        setInfo(ACCOUNT.forgotDone)
      } else if (mode === 'reset' && resetToken) {
        await resetPassword(resetToken, password)
        onDone('Hasło zmienione — jesteś zalogowany.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Coś poszło nie tak.')
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full rounded-xl border border-stone-200 px-3 py-2.5 outline-none focus:border-brand'

  return (
    <Modal open={!!mode} onClose={() => onMode(null)} label={mode ? ACCOUNT.titles[mode] : ''}>
      {mode && (
        <form onSubmit={submit} className="space-y-3 rounded-3xl bg-white p-5 text-stone-800">
          <h2 className="pr-10 text-2xl font-extrabold">{ACCOUNT.titles[mode]}</h2>
          {mode === 'register' && <p className="text-sm text-stone-600">{ACCOUNT.registerInfo}</p>}
          {mode === 'forgot' && <p className="text-sm text-stone-600">{ACCOUNT.forgotInfo}</p>}

          {mode !== 'reset' && (
            <input type="email" required autoComplete="email" placeholder="Adres e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          )}
          {mode !== 'forgot' && (
            <input
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder={mode === 'login' ? 'Hasło' : 'Hasło (min. 8 znaków)'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          )}
          {(mode === 'register' || mode === 'reset') && (
            <input type="password" required autoComplete="new-password" placeholder="Powtórz hasło" value={repeat} onChange={(e) => setRepeat(e.target.value)} className={input} />
          )}

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {info && <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand-ink">{info}</p>}

          <button disabled={busy} className="w-full rounded-full bg-black py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-50">
            {busy ? 'Chwileczkę…' : ACCOUNT.titles[mode]}
          </button>

          <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-stone-500">
            {mode !== 'login' && mode !== 'reset' && <LinkButton onClick={() => switchTo('login')}>Mam już konto</LinkButton>}
            {mode !== 'register' && mode !== 'reset' && <LinkButton onClick={() => switchTo('register')}>Załóż konto</LinkButton>}
            {mode === 'login' && <LinkButton onClick={() => switchTo('forgot')}>Nie pamiętam hasła</LinkButton>}
          </p>
        </form>
      )}
    </Modal>
  )
}

function LinkButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className="underline underline-offset-2 hover:text-stone-800">
      {children}
    </button>
  )
}
