# 🥦 Green Screen

> **Jedz kolorowo, nie licz kalorii.**

Prosty dziennik warzyw i owoców. Zamiast ważyć jedzenie i liczyć kalorie, odznaczasz garście: **5 porcji warzyw + 5 porcji owoców dziennie**. Aplikacja liczy wynik, pilnuje kolorów na talerzu, przypomina i podpowiada, czego brakuje.

🌐 **Wersja online:** [green-screen-one.vercel.app](https://green-screen-one.vercel.app) · ⚛️ React 19 · TypeScript · Tailwind CSS 4 · Vite · Vercel Functions · MySQL

---

## 🧭 Jak czytać ten plik

| Sekcja | O czym jest | Dla kogo |
| --- | --- | --- |
| [💡 Koncepcja](#-koncepcja) | Czym jest aplikacja, dla kogo i dlaczego | 🙂 każdy |
| [✨ Co potrafi aplikacja](#-co-potrafi-aplikacja) | Funkcje z perspektywy użytkownika | 🙂 każdy |
| [🧮 Jak liczony jest wynik](#-jak-liczony-jest-wynik) | Zasady punktów, kolorów i składników | 🙂 każdy |
| [🔬 Badania naukowe](#-badania-naukowe) | Na czym opierają się zasady | 🙂 każdy |
| [🗺️ Mapa projektu](#️-mapa-projektu) | **Most między koncepcją a kodem:** „chcę zmienić X → otwieram plik Y” | 🙂 + 👩‍💻 |
| [🚀 Uruchomienie](#-uruchomienie) | Jak włączyć aplikację i tryb testowy | 👩‍💻 |
| [🔄 Dane, konta i baza](#-dane-konta-i-baza) | Gość vs konto, przepływ danych, format danych, zmienne środowiskowe | 👩‍💻 |
| [☁️ Wdrożenie](#️-wdrożenie) | GitHub → Vercel, most na home.pl | 👩‍💻 |
| [🛠️ Decyzje techniczne](#️-decyzje-techniczne) | Co wybrano, jak to działa i dlaczego | 👩‍💻 |
| [🛣️ Roadmapa](#️-roadmapa) | Co już jest i co dalej | 🙂 + 👩‍💻 |

---

## 💡 Koncepcja

**Najlepsza dieta to ta, o której nie musisz bez przerwy myśleć.** Green Screen to nie jest kolejna aplikacja do liczenia kalorii. To narzędzie do zbudowania jednego prostego, zdrowego nawyku. Ty jesz, a aplikacja dba o resztę.

- 🥗 **Zasada 5 + 5.** 5 porcji warzyw i 5 porcji owoców dziennie, czyli ok. 800 g. Przy tej ilości badania obejmujące blisko 2 mln osób widzą najniższe ryzyko chorób serca, udaru i przedwczesnej śmierci.
- ✋ **Porcja = garść (ok. 80 g).** Średni owoc (jabłko, pomarańcza) albo garść drobnych (borówki, truskawki, groszek). Miarka jest zawsze przy Tobie.
- 🌈 **Kolory zamiast kalorii.** Każdy kolor to inna grupa witamin i związków roślinnych. Im bardziej tęczowy tydzień, tym lepiej.
- ⏱️ **10 sekund dziennie.** Zaznaczasz, co zjedzone, a wynik, kalendarz, podpowiedzi i odznaki liczą się same.

**Dla kogo:** dla każdego, kto chce jeść zdrowiej, ale nie ma ochoty ani potrzeby ważyć, liczyć i pilnować dziesiątek zasad.
**Dla kogo nie:** dla osób na diecie medycznej lub ścisłej redukcji z liczeniem kalorii. Aplikacja nie zastępuje porady lekarza ani dietetyka.

**Dwa tryby:**

- 🖐️ **Podstawowy:** 1 pozycja = 1 garść. Wybierasz z listy i gotowe.
- ⚖️ **Eksperta:** wpisujesz gramy z wagi kuchennej (80 g = 1 porcja) i dostajesz dokładniejszy wynik.

---

## ✨ Co potrafi aplikacja

| Ekran | Co tam jest |
| --- | --- |
| 👋 **Intro** | Przy pierwszym uruchomieniu: koncepcja, zasady, zdjęcia porcji i wybór trybu |
| 🏠 **Start** | Pierwszy ekran: baner danych demo, wykresy pierścieniowe witamin i minerałów z 7 dni, zielona karta „Dziś na talerzu” z przyciskiem „Dodaj więcej”, tabela dni z ikonkami (od pierwszej wizyty, bez starych pustych dni) |
| ➕ **Dziś** (czarny „+” na środku paska) | Wybór warzyw i owoców (lista z wyszukiwaniem — najpierw najpopularniejsze — i własnymi pozycjami z „×”), autozapis, wynik 0–100, kolory dnia, seria 🔥, wieczorne przypomnienie ⏰, jedna karta „Uzupełnij w tym tygodniu” (do 3 braków: kropka w brakującym kolorze + przykładowe produkty), dyskretny link „Jak to działa?” przy „+”, karuzela „Odkryj coś nowego” ✨, „Cofnij” po usunięciu, nagroda za 100 pkt 🎉 |
| 📅 **Kalendarz** | Miesiąc z porcjami i kolorem wyniku każdego dnia, podgląd i edycja dni z przeszłości, „W sezonie” 🗓️ dla oglądanego miesiąca z zielonym ✓ przy produktach zjedzonych w tym miesiącu |
| 🏆 **Odznaki** | Seria dni z rzędu i 36 odznak (część w kilku poziomach ★, każdy poziom to osobna odznaka); wielokrotne z licznikiem (×2, ×10…), ostatnio zdobyta na początku |
| 👤 **Konto** (nagłówek) | Gość dostaje losową nazwę (np. `user12213654`) i od razu korzysta; codzienny baner „Nie strać swoich danych” (z „×”); rejestracja (e-mail + hasło 2×), logowanie, „Nie pamiętam hasła”, mail powitalny z potwierdzeniem adresu; na intro link „Masz już konto? Zaloguj się” |
| 📚 **Baza wiedzy** | Lista tematów, każdy na osobnym ekranie ze strzałką powrotu: Warzywa i owoce (odblokowane w kolorze, reszta wyszarzona, ale z pełnym opisem; sortowanie: domyślnie, A–Z, kolorami) · Co się liczy, a co nie · Kolory · Witaminy i minerały · Jak przechowywać i przygotowywać · Mity i fakty · Kobieta w ciąży 🤰 · Nasze podejście vs dieta (z zastrzeżeniem „szacunki, nie diagnoza”) · Jak to działa? |

Na każdej ikonce produktu jest dymek: duża miniatura, kolor, jedno zdanie „dlaczego warto” i składniki w skali 1–5.

---

## 🧮 Jak liczony jest wynik

**Wynik dnia (0–100 pkt)**, formuła w [src/config/scoring.ts](src/config/scoring.ts):

| Część | Punkty | Pełna pula za |
| --- | --- | --- |
| 🥦 Warzywa | 35 | 5 porcji |
| 🍎 Owoce | 35 | 5 porcji |
| 🌈 Kolory | 20 | 5 kolorów |
| 🧺 Różnorodność | 10 | 6 różnych produktów |

Nadwyżka ponad cel nie daje dodatkowych punktów. **Strączki** (fasola, ciecierzyca, soczewica) liczą się maks. 1 porcja dziennie, zgodnie z zasadą z „Co się liczy, a co nie”. W trybie eksperta porcja **suszonych owoców** to 30 g, a nie 80 g. Przykład: 5 marchewek i 5 bananów to 81 pkt, a 10 różnych produktów w 5 kolorach to 100 pkt.

**🌈 Kolory** są pogrupowane według barwników, nie odcieni, w [src/config/balance.ts](src/config/balance.ts):

| Grupa | Barwniki | Przykłady | Min. w tygodniu |
| --- | --- | --- | --- |
| 🟢 Zielone | chlorofil, luteina | brokuł, szpinak, kiwi | 7 porcji |
| 🔴 Czerwone i różowe | likopen, antocyjany | pomidor, arbuz, maliny | 4 porcje |
| 🟠 Pomarańczowe i żółte | karotenoidy | marchew, dynia, cytryna | 4 porcje |
| 🟣 Fioletowe, niebieskie i czarne | antocyjany | borówki, śliwki, winogrona | 3 porcje |
| ⚪ Białe, beżowe i brązowe | kwercetyna, allicyna | czosnek, cebula, banan | 3 porcje |

Borówki i jeżyny mają te same antocyjany, więc są w jednej grupie. Liczy się kolor części, którą jemy (banan ma biały miąższ). Jeśli w ostatnich 7 dniach jakiegoś koloru było za mało, ekran „Dziś” to podpowie.

**🔬 Składniki** (wykresy na ekranie „Start”), opis w [src/config/nutrients.ts](src/config/nutrients.ts): każdy produkt ma orientacyjną zawartość 13 składników w skali 1–5. Wykresy liczą **ostatnie 7 dni**, bo normy dzienne to średnie, a nie każdy składnik musi być codziennie. 5 pierścieni = tyle, ile dałby tydzień 5 + 5 z równą mieszanką wszystkich produktów. To szacunek pokazujący kierunek, nie pomiar.

**🔥 Seria i 🏆 odznaki**, w [src/config/achievements.ts](src/config/achievements.ts): seria to dni z rzędu z co najmniej 1 wpisem (dziś bez wpisu nie przerywa serii do wczoraj). Odznaki z poziomami to osobne odznaki — każdy próg zdobywa się oddzielnie (progi w `TIERS`):

| Odznaka | Za co | Poziomy / powtarzanie |
| --- | --- | --- |
| 🌱 Pierwszy krok | pierwszy zapisany dzień | — |
| 💯 Setka · Setka ×N | dzień ze 100 pkt · łącznie N takich dni | ×N · 10 / 50 / 100 |
| 👑 Perfekcyjny tydzień | 7 dni z rzędu od 90 pkt | ×N |
| 🔥 Serie | dni z rzędu z wpisem | 3 / 7 / 30 / 100 / 365 |
| 🔄 Powrót | wpis po co najmniej 3 dniach przerwy | ×N |
| 🌈 Tęcza · Tęczowy tydzień | 5 kolorów jednego dnia · przez 7 dni z rzędu | ×N |
| 🟣 Fioletowa moc | porcje fioletowych w jednym miesiącu | 10 / 25 / 50, co miesiąc |
| 🥬 Zielona dziesiątka / trzydziestka | liściaste (znacznik `liściaste`) dni z rzędu | 10 / 30 |
| 🥒 Moc kiszonek · 🫘 Strączkowy tydzień | kiszonki / strączki w 3 dni tygodnia | ×N |
| 🌸☀️🍂❄️ Sezonowiec | 10 różnych produktów w sezonie w trakcie pory roku | 4 pory roku, co rok |
| 🍓 Polskie lato | truskawki, czereśnie, maliny, borówki i porzeczki jednego lata | co rok |
| 🧭 Odkrywca | różne warzywa i owoce łącznie | 10 / 20 / 40 / 60 |
| 🌴 Podróżnik | różne owoce egzotyczne (znacznik `egzotyczne`) | 5 / 10 |
| 🎒 Kolekcjoner | wszystkie 73 produkty z listy | — |
| ⚖️ Precyzja | dni z wpisanymi gramami (tryb eksperta) | 7 / 30 / 100 |

---

## 🔬 Badania naukowe

| Co z tego wynika | Źródło |
| --- | --- |
| Ok. 800 g (10 porcji) dziennie: najniższe ryzyko chorób serca i przedwczesnej śmierci | [Aune i in. 2017, Int J Epidemiol](https://doi.org/10.1093/ije/dyw319) |
| Ok. 5 porcji dziennie: najniższa śmiertelność w analizie ok. 2 mln osób | [Wang i in. 2021, Circulation](https://doi.org/10.1161/CIRCULATIONAHA.120.048996) |
| Minimum 400 g warzyw i owoców dziennie | [WHO — Healthy diet](https://www.who.int/news-room/fact-sheets/detail/healthy-diet) |
| Warzywa i owoce jako połowa każdego posiłku (zalecenia dla Polski) | [NCEZ (PZH) — Talerz zdrowego żywienia](https://ncez.pzh.gov.pl/abc-zywienia/talerz-zdrowego-zywienia/) |
| Normy żywieniowe UE (punkt odniesienia dla skali składników) | [EFSA — Dietary Reference Values](https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values) |
| 🌈 Różne kolory to różne związki o różnym działaniu („eat a rainbow”) | [Blumfield i in. 2022, Molecules](https://doi.org/10.3390/molecules27134061) |
| 🟢 1 porcja liściastych dziennie: wolniejsze starzenie się mózgu | [Morris i in. 2018, Neurology](https://doi.org/10.1212/WNL.0000000000004815) |
| 🟢 Azotany (zielone, buraki) obniżają ciśnienie krwi | [Siervo i in. 2013, J Nutr](https://doi.org/10.3945/jn.112.170233) |
| 🔴 Pomidory i likopen a czynniki ryzyka chorób serca | [Cheng i in. 2017, Atherosclerosis](https://doi.org/10.1016/j.atherosclerosis.2017.01.009) |
| 🟠 Witamina C i karotenoidy a ryzyko chorób serca i nowotworów | [Aune i in. 2018, Am J Clin Nutr](https://doi.org/10.1093/ajcn/nqy097) |
| 🟣 Min. 3 porcje borówek lub truskawek tygodniowo: mniej zawałów | [Cassidy i in. 2013, Circulation](https://doi.org/10.1161/CIRCULATIONAHA.112.122408) |
| 🧺 30+ roślin tygodniowo: bogatsza mikroflora jelit | [McDonald i in. 2018, mSystems](https://doi.org/10.1128/mSystems.00031-18) |

📚 Ta sama lista (z tytułami i linkami) jest w kodzie: `SOURCES` w [src/config/balance.ts](src/config/balance.ts).

⚠️ Badania obserwacyjne pokazują związek, nie dowodzą przyczyny. Minima dla kolorów czerwonego, pomarańczowego i białego, okres 7 dni dla składników i skala 1–5 to **założenia projektu**, opisane w plikach konfiguracyjnych.

---

## 🗺️ Mapa projektu

> 🌉 **Ta sekcja łączy koncepcję z kodem.** Każda zasada z sekcji powyżej ma dokładnie jedno miejsce w kodzie, bez duplikatów.

### ⚙️ Ustawienia i treści (sekcja dla osób nietechnicznych)

| Chcę zmienić… | Plik |
| --- | --- |
| 🍎 **Listę owoców i warzyw** (kolejność tematyczna, popularne na górze listy wyboru `POPULAR`, kolory, znaczniki kiszonka/strączki/suszone/liściaste/egzotyczne, gramy porcji, sezon, ikonki, opisy, składniki) | [src/config/produce.ts](src/config/produce.ts) |
| 🧮 **Punktację** (cele 5 + 5, wagi, gramy na porcję, limit strączków, formuła) | [src/config/scoring.ts](src/config/scoring.ts) |
| 📚 **Teksty Bazy wiedzy** (co się liczy, przechowywanie, mity, ciąża, podejście vs dieta) | [src/config/knowledge.ts](src/config/knowledge.ts) |
| 🌈 **Kolory i balans** (grupy, minima tygodniowe, podpowiedzi) · 🔬 **lista badań naukowych** | [src/config/balance.ts](src/config/balance.ts) |
| 🔬 **Witaminy i minerały** (nazwy, skala 1–5, wykresy z 7 dni) | [src/config/nutrients.ts](src/config/nutrients.ts) |
| 🏆 **Serie i odznaki** (progi poziomów `TIERS`, zasady `RULES`) | [src/config/achievements.ts](src/config/achievements.ts) |
| ✨ **„Odkryj coś nowego” (liczba propozycji) i sezonowość** | [src/config/discover.ts](src/config/discover.ts) |
| ⏰ **Przypomnienie** (godzina, treść) | [src/config/reminders.ts](src/config/reminders.ts) |
| ✍️ **Teksty** (nazwa, hasło, intro, „Jak to działa?”, tryby, baner demo, konto) | [src/config/texts.ts](src/config/texts.ts) |
| 🎨 **Kolor marki i font** (zieleń #22DD6A, Poppins, animacje) | [src/index.css](src/index.css) |
| 🖼️ **Ikony produktów** / **zdjęcia porcji** (brak pliku ikony = szare kółko z literą) | [ikonki/](ikonki/) · [src/assets/intro/](src/assets/intro/) |
| 📝 **Inne warianty tekstu intro** (archiwum) | [docs/intro-warianty.md](docs/intro-warianty.md) |

### 🗄️ Dane

| Co | Plik |
| --- | --- |
| **Sekrety i ustawienia serwera** (most do bazy, poczta, sesje, limity logowania) | [server/config.ts](server/config.ts) · wzór: [.env.example](.env.example) |
| **Baza danych** (operacje na użytkownikach przez most) | [server/database.ts](server/database.ts) |
| **Most do MySQL na home.pl** (PHP: tabela `users`, lista dozwolonych zapytań) | [bridge/bridge.php](bridge/bridge.php) · wzór sekretów: [bridge/bridge-config.example.php](bridge/bridge-config.example.php) |
| **Adresy API** (`/api/me`, `register`, `login`, `db`…) | [server/routes.ts](server/routes.ts) |
| **Hasła i sesje** (bcrypt, podpisane ciasteczko) | [server/auth.ts](server/auth.ts) |
| **Maile** (powitanie, nowe hasło) | [server/mail.ts](server/mail.ts) |
| **API na Vercelu** · **API lokalnie** | [api/[route].ts](api/[route].ts) · [server/devPlugin.ts](server/devPlugin.ts) |
| **Dane gościa** (losowa nazwa, pamięć przeglądarki) | [src/data/localDb.ts](src/data/localDb.ts) |
| **Sposób zapisu wyborów** (aplikacja → serwer, paczki co 0,5 s) | [src/data/api.ts](src/data/api.ts) |
| **Pusta baza, łączenie zmian** (wspólne dla serwera i aplikacji) | [src/data/changes.ts](src/data/changes.ts) |
| **Autozapis, stan aplikacji, logowanie** | [src/data/store.tsx](src/data/store.tsx) |
| **Linki z maili** (`?verified`, `?reset`) | [src/lib/linkParams.ts](src/lib/linkParams.ts) |
| **Dane demo** (30 dni wstecz) | [src/data/demo.ts](src/data/demo.ts) |
| **Kształt danych** (dzień, pozycja, ustawienia) | [src/types.ts](src/types.ts) |
| **Zegar i zmiana dnia o północy** | [src/hooks/useClock.ts](src/hooks/useClock.ts) |
| **Tryb testowy** (`?intro`, `?demo`, `?hour=`) | [src/lib/testParams.ts](src/lib/testParams.ts) |
| **Daty** (klucze dni, formatowanie) | [src/lib/date.ts](src/lib/date.ts) |

### 📱 Ekrany

| Ekran | Plik |
| --- | --- |
| Układ, nagłówek, dolny pasek z „+” na środku | [src/App.tsx](src/App.tsx) |
| 🏠 Start | [src/pages/StartPage.tsx](src/pages/StartPage.tsx) |
| 👋 Intro + wybór trybu | [src/pages/IntroPage.tsx](src/pages/IntroPage.tsx) |
| ➕ Dziś | [src/pages/TodayPage.tsx](src/pages/TodayPage.tsx) |
| 📅 Kalendarz | [src/pages/CalendarPage.tsx](src/pages/CalendarPage.tsx) |
| 🏆 Odznaki | [src/pages/BadgesPage.tsx](src/pages/BadgesPage.tsx) |
| 📚 Baza wiedzy (lista tematów: `SCREENS`) | [src/pages/KnowledgePage.tsx](src/pages/KnowledgePage.tsx) |

### 🧩 Elementy ekranów

| Element | Plik |
| --- | --- |
| Treść „Jak to działa?” · zielona karta · dyskretny link przy „+” | [HowItWorks.tsx](src/components/HowItWorks.tsx) · [HowItWorksCard.tsx](src/components/HowItWorksCard.tsx) · [HowItWorksLink.tsx](src/components/HowItWorksLink.tsx) |
| Ekrany Bazy wiedzy (kolory, witaminy, co się liczy, przechowywanie, mity, ciąża, podejście) + wspólne karty porad i ramka zastrzeżenia | [src/components/knowledge/](src/components/knowledge/) |
| Karta „Dziś na talerzu” na Starcie | [TodayProgress.tsx](src/components/TodayProgress.tsx) |
| Okno modalne · dymek „i” z badaniem | [Modal.tsx](src/components/Modal.tsx) · [InfoTip.tsx](src/components/InfoTip.tsx) |
| Katalog warzyw i owoców z sortowaniem (Baza wiedzy) · opis produktu (dymek i katalog) | [ProduceCatalog.tsx](src/components/ProduceCatalog.tsx) · [ProduceInfo.tsx](src/components/ProduceInfo.tsx) |
| Edycja dnia · grupa z „+”, gramami i „Cofnij” | [DayEditor.tsx](src/components/DayEditor.tsx) · [GroupSection.tsx](src/components/GroupSection.tsx) |
| Lista z wyszukiwaniem, „+ Dodaj …” i „×” przy własnych pozycjach | [ProduceSelect.tsx](src/components/ProduceSelect.tsx) |
| Ikonka produktu · dymek z witaminami | [ProduceIcon.tsx](src/components/ProduceIcon.tsx) · [ProduceTooltip.tsx](src/components/ProduceTooltip.tsx) |
| Wynik 0–100 i kolory dnia · nagroda za 100 pkt | [ScoreCard.tsx](src/components/ScoreCard.tsx) · [Celebration.tsx](src/components/Celebration.tsx) |
| Przypomnienie · podpowiedzi balansu · baner demo | [Reminder.tsx](src/components/Reminder.tsx) · [BalanceTips.tsx](src/components/BalanceTips.tsx) · [DemoBanner.tsx](src/components/DemoBanner.tsx) |
| Seria na „Dziś” · karuzela „Odkryj coś nowego” · „W sezonie” (kalendarz) | [StreakChip.tsx](src/components/StreakChip.tsx) · [DiscoverCard.tsx](src/components/DiscoverCard.tsx) · [SeasonCard.tsx](src/components/SeasonCard.tsx) |
| Wykresy pierścieniowe · seria i odznaki · tabela dni | [NutrientRings.tsx](src/components/NutrientRings.tsx) · [Badges.tsx](src/components/Badges.tsx) · [DaysTable.tsx](src/components/DaysTable.tsx) |
| Okno konta (rejestracja, logowanie, nowe hasło) · baner „Nie strać danych” · konto w nagłówku · komunikat | [AuthModal.tsx](src/components/AuthModal.tsx) · [AccountBanner.tsx](src/components/AccountBanner.tsx) · [AccountChip.tsx](src/components/AccountChip.tsx) · [Notice.tsx](src/components/Notice.tsx) |
| Podgląd dnia w kalendarzu · przełącznik trybu | [DaySummary.tsx](src/components/DaySummary.tsx) · [ModeSwitch.tsx](src/components/ModeSwitch.tsx) |

---

## 🚀 Uruchomienie

```bash
npm install            # tylko za pierwszym razem
cp .env.example .env.local   # tylko za pierwszym razem — wpisz adres mostu, pocztę i klucz sesji
npm run dev            # komputer: http://localhost:5173
npm run dev -- --host  # także telefon w tej samej sieci Wi-Fi (adres „Network” z terminala)
```

📱 **Na iPhonie:** otwórz adres „Network” w Safari, a potem wybierz **Udostępnij → Do ekranu początkowego**.

🧪 **Tryb testowy:** parametry w adresie pozwalają podejrzeć ekrany bez zmieniania danych.

| Adres | Co pokazuje |
| --- | --- |
| `?intro` | ekran intro |
| `?demo` | baner „Zaimportować dane demo?” |
| `?hour=21` | aplikację tak, jakby była 21:00 (wieczorne przypomnienie) |
| `?intro&demo&hour=21` | wszystko naraz |

---

## 🔄 Dane, konta i baza

👤 **Gość** (bez konta): przy pierwszym wejściu aplikacja nadaje losową nazwę, np. `user12213654`, i zapisuje wszystko w pamięci przeglądarki. Po dodaniu pierwszego produktu codziennie (do zamknięcia „×”) pojawia się baner „Nie strać swoich danych”.

🔐 **Konto:** rejestracja (e-mail + hasło 2×) przenosi dane z przeglądarki do MySQL i wysyła mail powitalny z linkiem potwierdzającym. Hasło jest zapisane tylko jako skrót bcrypt i nigdy nie trafia do maila. Logowanie na nowym urządzeniu dopisuje do konta dni z przeglądarki, których na koncie jeszcze nie ma.

```
Gość:        ekran → store.tsx → localDb.ts → pamięć przeglądarki (localStorage)
Zalogowany:  ekran → store.tsx → api.ts (PATCH /api/db, paczki co 0,5 s) → server/routes.ts (Vercel) → server/database.ts
             → HTTPS + tajny klucz → bridge/bridge.php (home.pl) → MySQL mysql8
```

Tabela `users` tworzy się sama przy pierwszym zapytaniu. Dane użytkownika są w kolumnie `data` (JSON) i mają taki kształt:

```json
{
  "settings": { "mode": "basic", "demoOffered": true, "hiddenCustom": [], "startDate": "2026-10-08" },
  "days": {
    "2026-10-15": { "vegetables": [{ "name": "Marchew" }], "fruits": [{ "name": "Jabłko", "grams": 150 }] }
  }
}
```

- `mode: null` → aplikacja startuje od intro, „jak nowa”.
- Każdy element listy to jedna pozycja. `grams` jest używane tylko w trybie eksperta.
- Własne pozycje zapisują się tak samo i potem same pojawiają się na liście wyboru. „×” przy nich na liście dopisuje je do `hiddenCustom` (historia dni zostaje bez zmian), a ponowne wpisanie tej nazwy przywraca je na listę.
- Puste dni nie są zapisywane.
- `startDate` to dzień pierwszej wizyty — od niego zaczyna się lista ostatnich dni na „Start” (wcześniejsze dni da się uzupełnić w kalendarzu).

### 🔑 Zmienne środowiskowe

Lokalnie w `.env.local` (poza repozytorium), na Vercelu w **Settings → Environment Variables**. Wzór: [.env.example](.env.example).

| Zmienna | Co to |
| --- | --- |
| `BRIDGE_URL`, `BRIDGE_SECRET` | Adres `bridge.php` na home.pl (**tylko `https://`**, inaczej serwer odmówi) i tajny klucz (ten sam co `secret` w `bridge-config.php`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM` | Skrzynka noreply do maili (port 465 = SSL) |
| `SESSION_SECRET` | Długi losowy ciąg do podpisywania sesji |

---

## ☁️ Wdrożenie

```
GitHub (kod) ──push──▶ Vercel (strona + /api) ──HTTPS──▶ bartosz.space/green-screen-api/bridge.php ──▶ MySQL (home.pl)
                                    └──SMTP 465──▶ noreply@bartosz.space (maile)
```

1. **Kod:** `git push origin main` — Vercel sam buduje (`npm run build`) i wdraża każdą zmianę.
2. **Vercel:** zmienne środowiskowe z tabeli powyżej w **Settings → Environment Variables**. Po ich zmianie: **Deployments → ⋯ → Redeploy**.
3. **home.pl:** w folderze `green-screen-api` domeny głównej (ma darmowy certyfikat SSL) leżą 3 pliki z [bridge/](bridge/): `bridge.php`, `bridge-config.php` (sekrety, poza repozytorium) i `.htaccess`. Tabela `users` tworzy się sama.
4. **Test mostu:** otwarcie adresu mostu w przeglądarce pokazuje `{"error":"Only POST"}`.

---

## 🛠️ Decyzje techniczne

| Decyzja | Jak to działa | Dlaczego |
| --- | --- | --- |
| ⚛️ **React 19 + TypeScript + Vite** | Komponenty funkcyjne, ścisłe typy, szybki serwer deweloperski | Standard rynkowy, błędy w danych wychodzą już przy kompilacji |
| 🎯 **Jedno źródło prawdy** | Zasady i treści żyją w `src/config/*`, ekrany tylko je czytają. Np. ta sama `calculateScore` liczy wynik na „Dziś”, w kalendarzu, tabeli i odznakach | Zmiana zasady w jednym miejscu zmienia całą aplikację, bez rozjazdów |
| 🧮 **Liczymy, nie zapisujemy** | Wynik, kolory, serie, odznaki (z licznikami i datami), wykresy, odblokowane produkty i lista własnych pozycji są wyliczane z zapisanych dni | Baza trzyma tylko fakty („co zjedzone”), więc nic nie może się rozsynchronizować |
| 👤 **Najpierw gość, potem konto** | Dane gościa w `localStorage`, konto dopiero gdy użytkownik zechce | Zero barier na start: aplikacja działa od pierwszej sekundy |
| ☁️ **Vercel Functions + MySQL na home.pl** | Jeden plik `api/[route].ts` kieruje wszystkie `/api/*` do `server/routes.ts`; lokalnie te same funkcje podpina wtyczka Vite | Jeden kod API dla produkcji i lokalnie; baza na posiadanym serwerze, bez dodatkowych usług |
| 🔁 **Ponowienie odczytu** | Przy chwilowym błędzie bazy (5xx) most powtarza odczyt (`find…`) jeden raz; błędny klucz daje w logach jasny komunikat | Pojedyncze błędy hostingu nie psują logowania ani rejestracji |
| 🌉 **Most PHP do bazy** | Hosting współdzielony home.pl nie wpuszcza połączeń MySQL z zewnątrz, więc `bridge/bridge.php` działa na tym samym serwerze i wykonuje tylko nazwane, sparametryzowane zapytania po podaniu tajnego klucza; aplikacja łączy się z nim wyłącznie przez HTTPS | Baza zostaje na home.pl, a cała logika kont (hasła, sesje, maile) zostaje w TypeScripcie |
| 🗄️ **Dane użytkownika jako JSON w MySQL** | Kolumna `data` trzyma cały obiekt z `types.ts`, zmiany nakłada `applyChanges` | Ten sam model danych na ekranie, w przeglądarce i w bazie, bez mapowania na wiele tabel |
| 🔐 **Bezpieczeństwo kont** | bcrypt, podpisane ciasteczko HttpOnly (HMAC), blokada po 5 błędnych hasłach, tokeny do linków z maili, ta sama odpowiedź „Nie pamiętam hasła” dla istniejących i nieistniejących adresów | Standardowe minimum, bez zewnętrznych usług logowania |
| 📦 **Paczkowanie zapisów** | `api.ts` łączy zmiany z 0,5 s w jeden `PATCH` (i wysyła resztę przy zamykaniu karty) | Wpisywanie gramów nie zalewa bazy zapytaniami |
| 🔁 **Wspólna zasada łączenia zmian** | `data/changes.ts` (pusta baza, `applyChanges`, `mergeChanges`) jest używane przez serwer i przez aplikację | Ekran od razu pokazuje dokładnie to, co zapisze serwer |
| ⚡ **Autozapis optymistyczny** | `store.tsx` (React Context) najpierw aktualizuje ekran, potem zapisuje w przeglądarce albo wysyła `PATCH` | Brak przycisku „Zapisz”, a interfejs reaguje natychmiast |
| 🧠 **React Context zamiast Redux** | Jeden `useStore()` z danymi, trybem i akcjami | Mała aplikacja, a dodatkowa biblioteka nic by nie dała |
| 📅 **Dni jako klucze `RRRR-MM-DD` w czasie lokalnym** | `useClock` co 30 s sprawdza datę | Prosta zmiana dnia o północy i czytelny plik bazy |
| 🎨 **Tailwind CSS v4 + tokeny marki** | Kolory w `@theme` w `index.css` (`bg-brand`, `text-brand-ink`…) | Jeden plik wyglądu; kontrast sprawdzony (czarny na zieleni 11,6:1) |
| 📊 **Własne wykresy w SVG** | Wycinki pierścieni rysowane ścieżkami SVG, jeden odcień zieleni, dymki po najechaniu, opis dla czytników ekranu | Wykresu pierścieniowego nie ma w typowych bibliotekach, a własny kod jest mały i w pełni kontrolowany |
| 🧭 **Nawigacja bez routera** | Zakładki i ekrany Bazy wiedzy to stan Reacta (`useState`) | Mało ekranów; adresy URL (React Router) są w roadmapie |
| 🎠 **Karuzela na CSS scroll-snap** | Natywne przewijanie palcem + strzałki i kropki sterujące `scrollTo` | Działa płynnie na telefonie, bez biblioteki |
| 🪟 **Okna na natywnym `<dialog>`** | `Modal.tsx` używa `showModal()`: Esc, kliknięcie w tło, blokada przewijania strony pod spodem | Dostępność i obsługa klawiatury „za darmo”, bez biblioteki |
| 💬 **Dymki przez portal** | `createPortal` + pozycja przycięta do ekranu; mysz otwiera najechaniem, dotyk stuknięciem | Działają też w tabeli i przy krawędziach ekranu, na komputerze i na telefonie |
| 🔤 **Font lokalnie (`@fontsource/poppins`)** | Pliki fontu w paczce aplikacji | Brak zapytań do Google, działa offline, lepsza prywatność |
| 🖼️ **Ikony** | Produkty: PNG z `ikonki/` jako katalog publiczny Vite (bez kopiowania); interfejs: `lucide-react` | Zero duplikatów plików; do paczki trafiają tylko użyte ikony |
| 🎉 **Animacje w czystym CSS** | `@keyframes` w `index.css` | Bez dodatkowych bibliotek |
| 🧪 **Tryb testowy w adresie** | `lib/testParams.ts` czyta `?intro`, `?demo`, `?hour` | Podgląd każdego ekranu bez grzebania w danych |
| 🔒 **Sekrety poza repozytorium** | `.env.local` i `bridge/bridge-config.php` w `.gitignore`, na Vercelu zmienne środowiskowe; w repozytorium tylko wzory (`.env.example`, `bridge-config.example.php`) | Hasła do bazy i poczty nigdy nie trafiają na GitHuba |

**Znane ograniczenia:**

- brak testów automatycznych,
- okres 7 dni dla wykresów i podpowiedzi to założenie projektu (wzorowane na tygodniowych celach w zaleceniach żywieniowych), a nie wynik badań porównujących różne okresy,
- każde zapytanie do bazy idzie przez most na home.pl, więc jest o kilkadziesiąt ms wolniejsze niż bezpośrednie połączenie,
- zalogowany użytkownik bez internetu widzi dane, ale zmiany nie zapiszą się na koncie,
- zawartość składników to szacunki,
- zapis nie ponawia się przy błędzie sieci.

---

## 🛣️ Roadmapa

**✅ Gotowe**

- [x] Dziennik 5 + 5, tryb podstawowy i eksperta, autozapis, własne pozycje
- [x] Kalendarz, tabela z ikonkami, dymki z witaminami
- [x] Balans kolorów, wieczorne przypomnienie, dane demo
- [x] Intro w kolorach marki, zakładka „Jak to działa?”, wykresy witamin i minerałów
- [x] Serie i odznaki, nagroda za 100 pkt, „Odkryj coś nowego”, sezonowość, „Cofnij”
- [x] Baza wiedzy (katalog produktów), okno „Jak to działa?”, odznaki z licznikami, 7 nowych produktów, usuwanie własnych pozycji
- [x] Ekran Start z „+” na środku paska, osobne Odznaki, 8 tematów Bazy wiedzy, odznaka za kiszonki, strączki i nowe warzywa, karuzela propozycji
- [x] 16 nowych owoców (m.in. porzeczki, aronia, suszone z porcją 30 g), winogrona ciemne i jasne, sezon w kalendarzu
- [x] 🌐 Tryb gościa, konta (MySQL na home.pl przez most PHP po HTTPS), maile, wersja online na Vercelu
- [x] 🏆 36 odznak z poziomami, ikony wszystkich 73 produktów, popularne na górze listy, sortowanie katalogu, ✓ przy sezonowych

**🔜 Dalej**

- [ ] 🔄 Zapis offline dla zalogowanych (kolejka zmian do wysłania po powrocie internetu)
- [ ] 🧪 Testy (Vitest, Testing Library, Playwright) i CI na GitHub Actions
- [ ] 📲 PWA: instalacja na telefonie, działanie offline, powiadomienia push
- [ ] 📆 Podsumowanie tygodnia i przypomnienie w kalendarzu telefonu (.ics)
- [ ] 🐟 Nowe kategorie: ryby, mięso, jajka, zdrowe tłuszcze, zdrowe węglowodany, woda
- [ ] 🍕 Kategoria „ograniczaj”: fast food, białe pieczywo, pizza, tosty, słodkie napoje (odejmuje punkty)
- [ ] 🗑️ Usuwanie danych demo jednym kliknięciem
- [ ] ➕ Piąta zakładka w dolnym pasku (pomysł do ustalenia)
