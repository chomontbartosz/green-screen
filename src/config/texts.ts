// TEKSTY — nazwa, hasło, intro i „Jak to działa?”, opisy trybów, baner demo. Tu zmieniasz treści bez dotykania kodu.
// Inne warianty tekstu intro (na przyszłość): docs/intro-warianty.md

import type { Mode } from '../types'
import { SOURCES } from './balance'

export const APP_NAME = 'Green Screen'

export const TAGLINE = 'Jedz kolorowo, nie licz kalorii.'

export const INTRO = {
  headline: 'Twój nowy, zdrowszy nawyk. Bez kalkulatora.',
  lead:
    'Najlepsza dieta to ta, o której nie musisz bez przerwy myśleć. Zamiast ważyć jedzenie i liczyć kalorie, po prostu odznaczaj to, co ląduje na Twoim talerzu. Dlaczego? Bo zdrowe jedzenie nie musi być czasochłonne ani wymagać przestrzegania dziesiątek zasad dietetycznych. Zamiast tego zacznij od czegoś prostego! Ty jesz, a aplikacja dba o resztę.',
  research: {
    title: 'Co mówią badania?',
    summary:
      'Przegląd 95 badań wykazał, że ok. 800 g warzyw i owoców dziennie (10 porcji) wiąże się z najniższym ryzykiem chorób serca, udaru i przedwczesnej śmierci.',
    source: SOURCES.aune2017,
  },
  howTitle: 'Jak to działa?',
  steps: [
    {
      title: 'Zasada 5 + 5',
      text: 'Zjedz 5 porcji warzyw i 5 porcji owoców każdego dnia. To dawka zdrowia potwierdzona w badaniach na blisko 2 mln osób, która daje kopa do działania i chroni Twój organizm.',
    },
    {
      title: 'Tęcza na ekranie',
      text: 'Nie jedz nudno! Im więcej kolorów odznaczysz na ekranie, tym więcej różnych witamin dostanie Twój organizm. Skittles się nie liczą.',
    },
    {
      title: 'Jedna porcja to pełna garść',
      text: 'Zapomnij o wadze kuchennej. Twoja idealna miarka jest zawsze z Tobą. Jedna porcja to Twoja jedna garść (ok. 80 g).',
    },
  ],
  photos: [
    { caption: 'Średni owoc = 1 porcja', examples: 'np. jabłko, pomarańcza, granat', alt: 'Granat na otwartej dłoni' },
    { caption: 'Garść drobnych = 1 porcja', examples: 'np. borówki, truskawki, groszek', alt: 'Garść borówek na dłoni' },
  ],
  photoNote: '👉 Tak, właśnie tyle! Masz to dosłownie w ręku.',
  chooseMode: 'Jak chcesz liczyć?',
}

export const MODES: Record<Mode, { label: string; description: string }> = {
  basic: {
    label: 'Tryb podstawowy',
    description: '1 porcja = 1 garść (ok. 80 g). Wybierasz z listy, co było na talerzu — i gotowe.',
  },
  expert: {
    label: 'Tryb eksperta',
    description: 'Dla korzystających z wagi kuchennej: wpisujesz gramy i dostajesz dokładniejszy wynik.',
  },
}

export const DEMO = {
  question: 'Zaimportować dane demo?',
  text: 'Wypełnimy przykładowymi danymi ostatnie 30 dni, żeby od razu zobaczyć wykresy, kalendarz i odznaki w akcji. Dzisiejszy dzień zostaje pusty dla Ciebie.',
  accept: 'Importuj dane demo',
  decline: 'Nie, dzięki',
}

export const ACCOUNT = {
  banner: {
    title: '💾 Nie strać swoich danych',
    text: 'Na razie wszystko jest zapisane tylko w tej przeglądarce. Załóż darmowe konto, a dane będą bezpieczne i dostępne na każdym urządzeniu.',
    register: 'Załóż konto',
    login: 'Mam już konto',
  },
  titles: { register: 'Załóż konto', login: 'Zaloguj się', forgot: 'Nie pamiętam hasła', reset: 'Ustaw nowe hasło' },
  registerInfo: 'Twoje dotychczasowe wpisy zostaną przeniesione na konto. Na podany adres wyślemy powitanie z linkiem potwierdzającym.',
  forgotInfo: 'Podaj adres konta — wyślemy link do ustawienia nowego hasła.',
  forgotDone: 'Jeśli konto z tym adresem istnieje, wysłaliśmy link do zmiany hasła. Sprawdź skrzynkę (także spam).',
  registered: 'Konto założone! Sprawdź skrzynkę i potwierdź adres e-mail.',
  verified: '✅ Adres e-mail potwierdzony. Dzięki!',
  verifyFailed: 'Ten link potwierdzający jest nieaktualny.',
  passwordsDiffer: 'Hasła się różnią.',
}
