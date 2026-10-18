// KONFIGURACJA SERWERA — jedyne miejsce, które czyta zmienne środowiskowe (sekrety) i ustawienia kont.
// Lokalnie wartości są w .env.local, na Vercelu w Settings → Environment Variables. Wzór: .env.example.

const env = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`Brak zmiennej środowiskowej ${name} (zob. .env.example)`)
  return value
}

export const BRIDGE = {
  // adres bridge.php na home.pl (most do bazy MySQL, zob. bridge/) — tylko HTTPS, bo w nagłówku leci tajny klucz
  url: () => {
    const url = env('BRIDGE_URL')
    if (!url.startsWith('https://')) throw new Error('BRIDGE_URL musi zaczynać się od https://')
    return url
  },
  secret: () => env('BRIDGE_SECRET'), // ten sam ciąg co 'secret' w bridge-config.php
}

export const SMTP = {
  host: () => env('SMTP_HOST'),
  port: () => Number(process.env.SMTP_PORT ?? 465),
  user: () => env('SMTP_USER'),
  password: () => env('SMTP_PASSWORD'),
  from: () => process.env.MAIL_FROM ?? env('SMTP_USER'),
}

export const AUTH = {
  secret: () => env('SESSION_SECRET'), // klucz do podpisywania ciasteczek sesji
  cookie: 'gs_session',
  sessionDays: 90, // jak długo trwa zalogowanie
  passwordMinLength: 8,
  maxFailedLogins: 5, // po tylu błędnych hasłach konto blokuje się na chwilę
  lockMinutes: 15,
  resetLinkHours: 1, // ważność linku „Nie pamiętam hasła”
}
