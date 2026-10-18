// PAMIĘĆ PRZEGLĄDARKI — dane gościa (bez konta): losowa nazwa typu user12213654 i cała baza w localStorage.
// Po założeniu konta lub zalogowaniu dane trafiają na serwer, a pamięć gościa jest czyszczona.

import type { Database } from '../types'
import { EMPTY_DB, normalizeDb } from './changes'

const KEY = 'green-screen'

type Guest = { guestName: string; db: Database }

const newGuestName = () => `user${Math.floor(10_000_000 + Math.random() * 90_000_000)}`

function read(): Guest | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeGuest(guest: Guest) {
  try {
    localStorage.setItem(KEY, JSON.stringify(guest))
  } catch {
    // pełna lub zablokowana pamięć — aplikacja działa dalej, tylko bez zapisu
  }
}

/** Gość z pamięci przeglądarki albo nowy. */
export function loadGuest(): Guest {
  const saved = read()
  if (saved) return { guestName: saved.guestName, db: normalizeDb(saved.db) }
  const guest = { guestName: newGuestName(), db: normalizeDb(EMPTY_DB) }
  writeGuest(guest)
  return guest
}

/** Nowy, pusty gość (np. po wylogowaniu) — zachowuje tylko wybrany tryb. */
export function resetGuest(mode: Database['settings']['mode']): Guest {
  const guest = { guestName: newGuestName(), db: normalizeDb({ settings: { ...EMPTY_DB.settings, mode, demoOffered: true } }) }
  writeGuest(guest)
  return guest
}

/** Czyści dane gościa (po przeniesieniu ich na konto). */
export function clearGuest() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // brak dostępu do pamięci — nic do wyczyszczenia
  }
}
