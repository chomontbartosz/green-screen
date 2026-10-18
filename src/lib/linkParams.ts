// Parametry z linków w mailach: ?verified=1 (potwierdzenie adresu) i ?reset=TOKEN (nowe hasło).
// Po odczytaniu usuwamy je z paska adresu, żeby odświeżenie strony nie powtarzało akcji.

const params = new URLSearchParams(window.location.search)

export const LINK = {
  verified: params.get('verified'), // '1' = potwierdzono, '0' = link nieaktualny
  resetToken: params.get('reset'),
}

if (LINK.verified !== null || LINK.resetToken) {
  params.delete('verified')
  params.delete('reset')
  const rest = params.toString()
  window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : ''))
}
