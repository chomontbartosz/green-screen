// Kształt danych w całej aplikacji (i w pliku data/db.json).

export type Group = 'vegetables' | 'fruits'

/** basic = 1 pozycja to 1 porcja (garść), expert = liczy się gramatura */
export type Mode = 'basic' | 'expert'

/** Jedna zjedzona pozycja. Gramy wpisuje się tylko w trybie eksperta. */
export type Item = { name: string; grams?: number }

/** Jeden dzień, np. { vegetables: [{ name: 'Marchew' }], fruits: [{ name: 'Jabłko', grams: 150 }] } */
export type DayEntry = Record<Group, Item[]>

/** Wszystkie dni — klucz to data RRRR-MM-DD */
export type Days = Record<string, DayEntry>

export type Settings = {
  mode: Mode | null // null = użytkownik nie przeszedł jeszcze ekranu intro
  demoOffered: boolean // true = propozycja importu danych demo została już przyjęta lub odrzucona
}

/** Cała baza */
export type Database = { settings: Settings; days: Days }

/** Zmiana wysyłana do bazy: dowolne ustawienia i/lub dowolne dni */
export type DbChanges = { settings?: Partial<Settings>; days?: Days }
