// TRYB TESTOWY — parametry w adresie strony do podglądu ekranów, bez zmieniania danych:
//   ?intro      → pokazuje ekran intro, nawet jeśli tryb jest już wybrany
//   ?demo       → pokazuje baner „Zaimportować dane demo?”, nawet jeśli był już przyjęty lub odrzucony
//   ?hour=21    → aplikacja „udaje”, że jest godzina 21:00 (np. żeby zobaczyć przypomnienie)
// Parametry można łączyć: ?intro&demo&hour=21

const params = new URLSearchParams(window.location.search)
const hour = Number(params.get('hour'))

export const TEST = {
  intro: params.has('intro'),
  demo: params.has('demo'),
  hour: params.has('hour') && hour >= 0 && hour <= 23 ? hour : null,
}
