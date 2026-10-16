# 🥦 Green Screen

> **Jedz kolorowo, nie licz kalorii.**

Prosty dziennik warzyw i owoców. Zamiast ważyć jedzenie i liczyć kalorie, odznaczasz garście: **5 porcji warzyw + 5 porcji owoców dziennie**. Aplikacja liczy wynik, pilnuje kolorów na talerzu, przypomina i podpowiada, czego brakuje.

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
| [🔄 Dane i baza](#-dane-i-baza) | Jak zapisują się wybory, format pliku bazy | 👩‍💻 |
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
| 🥗 **Dziś** | Wybór warzyw i owoców (lista z wyszukiwaniem i własnymi pozycjami), autozapis, wynik 0–100, kolory dnia, seria 🔥, wieczorne przypomnienie ⏰, podpowiedzi balansu 💡, „Odkryj coś nowego” ✨, „W sezonie” 🗓️, „Cofnij” po usunięciu, nagroda za 100 pkt 🎉 |
| 📅 **Kalendarz** | Miesiąc z porcjami i kolorem wyniku każdego dnia, podgląd i edycja dni z przeszłości |
| 📊 **Podsumowanie** | Wykresy pierścieniowe witamin i minerałów z 7 dni, seria dni, odznaki 🏆, tabela dni z ikonkami |
| 💡 **Jak to działa?** | Ta sama treść co intro, dostępna w każdej chwili |

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

Nadwyżka ponad cel nie daje dodatkowych punktów. Przykład: 5 marchewek i 5 bananów to 81 pkt, a 10 różnych produktów w 5 kolorach to 100 pkt.

**🌈 Kolory** są pogrupowane według barwników, nie odcieni, w [src/config/balance.ts](src/config/balance.ts):

| Grupa | Barwniki | Przykłady | Min. w tygodniu |
| --- | --- | --- | --- |
| 🟢 Zielone | chlorofil, luteina | brokuł, szpinak, kiwi | 7 porcji |
| 🔴 Czerwone i różowe | likopen, antocyjany | pomidor, arbuz, maliny | 4 porcje |
| 🟠 Pomarańczowe i żółte | karotenoidy | marchew, dynia, cytryna | 4 porcje |
| 🟣 Fioletowe, niebieskie i czarne | antocyjany | borówki, śliwki, winogrona | 3 porcje |
| ⚪ Białe, beżowe i brązowe | kwercetyna, allicyna | czosnek, cebula, banan | 3 porcje |

Borówki i jeżyny mają te same antocyjany, więc są w jednej grupie. Liczy się kolor części, którą jemy (banan ma biały miąższ). Jeśli w ostatnich 7 dniach jakiegoś koloru było za mało, ekran „Dziś” to podpowie.

**🔬 Składniki** (wykresy w „Podsumowaniu”), opis w [src/config/nutrients.ts](src/config/nutrients.ts): każdy produkt ma orientacyjną zawartość 13 składników w skali 1–5. Wykresy liczą **ostatnie 7 dni**, bo normy dzienne to średnie, a nie każdy składnik musi być codziennie. 5 pierścieni = tyle, ile dałby tydzień 5 + 5 z równą mieszanką wszystkich produktów. To szacunek pokazujący kierunek, nie pomiar.

**🔥 Seria i 🏆 odznaki**, w [src/config/achievements.ts](src/config/achievements.ts): dzień liczy się do serii od 60 pkt. Odznak jest 9, np. „Tęcza” (5 kolorów jednego dnia) albo „Kolekcjoner” (wszystkie 40 produktów).

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

⚠️ Badania obserwacyjne pokazują związek, nie dowodzą przyczyny. Minima dla kolorów czerwonego, pomarańczowego i białego, okres 7 dni dla składników i skala 1–5 to **założenia projektu**, opisane w plikach konfiguracyjnych.

---

## 🗺️ Mapa projektu

> 🌉 **Ta sekcja łączy koncepcję z kodem.** Każda zasada z sekcji powyżej ma dokładnie jedno miejsce w kodzie, bez duplikatów.

### ⚙️ Ustawienia i treści (tu zmieniasz zasady bez znajomości Reacta)

| Chcę zmienić… | Plik |
| --- | --- |
| 🍎 **Listę owoców i warzyw** (nazwy, kolory, sezon, ikonki, opisy, składniki) | [src/config/produce.ts](src/config/produce.ts) |
| 🧮 **Punktację** (cele 5 + 5, wagi, gramy na porcję, formuła) | [src/config/scoring.ts](src/config/scoring.ts) |
| 🌈 **Kolory i balans** (grupy, minima tygodniowe, podpowiedzi, źródła) | [src/config/balance.ts](src/config/balance.ts) |
| 🔬 **Witaminy i minerały** (nazwy, skala 1–5, wykresy z 7 dni) | [src/config/nutrients.ts](src/config/nutrients.ts) |
| 🏆 **Serie i odznaki** | [src/config/achievements.ts](src/config/achievements.ts) |
| ✨ **„Odkryj coś nowego” i sezonowość** | [src/config/discover.ts](src/config/discover.ts) |
| ⏰ **Przypomnienie** (godzina, treść) | [src/config/reminders.ts](src/config/reminders.ts) |
| ✍️ **Teksty** (nazwa, hasło, intro, „Jak to działa?”, tryby, baner demo) | [src/config/texts.ts](src/config/texts.ts) |
| 🎨 **Kolor marki i font** (zieleń #22DD6A, Poppins, animacje) | [src/index.css](src/index.css) |
| 🖼️ **Ikony produktów** / **zdjęcia porcji** | [ikonki/](ikonki/) · [src/assets/intro/](src/assets/intro/) |
| 📝 **Inne warianty tekstu intro** (archiwum) | [docs/intro-warianty.md](docs/intro-warianty.md) |

### 🗄️ Dane

| Co | Plik |
| --- | --- |
| **Baza danych** (plik, odczyt, zapis na dysk, API) | [server/database.ts](server/database.ts) |
| **Same dane** użytkownika i ustawienia | `data/db.json` (tworzy się sam, nie trafia do repozytorium) |
| **Sposób zapisu wyborów** (aplikacja → baza) | [src/data/api.ts](src/data/api.ts) |
| **Zasada łączenia zmian** (wspólna dla serwera i aplikacji) | [src/data/changes.ts](src/data/changes.ts) |
| **Autozapis i stan aplikacji** | [src/data/store.tsx](src/data/store.tsx) |
| **Dane demo** (30 dni wstecz) | [src/data/demo.ts](src/data/demo.ts) |
| **Kształt danych** (dzień, pozycja, ustawienia) | [src/types.ts](src/types.ts) |
| **Zegar i zmiana dnia o północy** | [src/hooks/useClock.ts](src/hooks/useClock.ts) |
| **Tryb testowy** (`?intro`, `?demo`, `?hour=`) | [src/lib/testParams.ts](src/lib/testParams.ts) |
| **Daty** (klucze dni, formatowanie) | [src/lib/date.ts](src/lib/date.ts) |

### 📱 Ekrany

| Ekran | Plik |
| --- | --- |
| Układ, nagłówek, dolny pasek zakładek | [src/App.tsx](src/App.tsx) |
| 👋 Intro + wybór trybu | [src/pages/IntroPage.tsx](src/pages/IntroPage.tsx) |
| 🥗 Dziś | [src/pages/TodayPage.tsx](src/pages/TodayPage.tsx) |
| 📅 Kalendarz | [src/pages/CalendarPage.tsx](src/pages/CalendarPage.tsx) |
| 📊 Podsumowanie | [src/pages/SummaryPage.tsx](src/pages/SummaryPage.tsx) |
| 💡 Jak to działa? | [src/pages/HowItWorksPage.tsx](src/pages/HowItWorksPage.tsx) |

### 🧩 Elementy ekranów

| Element | Plik |
| --- | --- |
| Treść „Jak to działa?” (intro i zakładka) · dymek „i” z badaniem | [HowItWorks.tsx](src/components/HowItWorks.tsx) · [InfoTip.tsx](src/components/InfoTip.tsx) |
| Edycja dnia · grupa z „+”, gramami i „Cofnij” | [DayEditor.tsx](src/components/DayEditor.tsx) · [GroupSection.tsx](src/components/GroupSection.tsx) |
| Lista z wyszukiwaniem i „+ Dodaj …” | [ProduceSelect.tsx](src/components/ProduceSelect.tsx) |
| Ikonka produktu · dymek z witaminami | [ProduceIcon.tsx](src/components/ProduceIcon.tsx) · [ProduceTooltip.tsx](src/components/ProduceTooltip.tsx) |
| Wynik 0–100 i kolory dnia · nagroda za 100 pkt | [ScoreCard.tsx](src/components/ScoreCard.tsx) · [Celebration.tsx](src/components/Celebration.tsx) |
| Przypomnienie · podpowiedzi balansu · baner demo | [Reminder.tsx](src/components/Reminder.tsx) · [BalanceTips.tsx](src/components/BalanceTips.tsx) · [DemoBanner.tsx](src/components/DemoBanner.tsx) |
| Seria na „Dziś” · „Odkryj coś nowego” · „W sezonie” | [StreakChip.tsx](src/components/StreakChip.tsx) · [DiscoverCard.tsx](src/components/DiscoverCard.tsx) · [SeasonCard.tsx](src/components/SeasonCard.tsx) |
| Wykresy pierścieniowe · seria i odznaki · tabela dni | [NutrientRings.tsx](src/components/NutrientRings.tsx) · [Badges.tsx](src/components/Badges.tsx) · [DaysTable.tsx](src/components/DaysTable.tsx) |
| Podgląd dnia w kalendarzu · przełącznik trybu | [DaySummary.tsx](src/components/DaySummary.tsx) · [ModeSwitch.tsx](src/components/ModeSwitch.tsx) |

---

## 🚀 Uruchomienie

```bash
npm install            # tylko za pierwszym razem
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

## 🔄 Dane i baza

```
Wybór na ekranie → store.tsx (od razu na ekranie) → api.ts (PATCH /api/db) → server/database.ts → data/db.json
```

```json
{
  "settings": { "mode": "basic", "demoOffered": true },
  "days": {
    "2026-10-15": { "vegetables": [{ "name": "Marchew" }], "fruits": [{ "name": "Jabłko", "grams": 150 }] }
  }
}
```

- `mode: null` albo brak pliku → aplikacja startuje od intro, „jak nowa”.
- Każdy element listy to jedna pozycja. `grams` jest używane tylko w trybie eksperta.
- Własne pozycje zapisują się tak samo i potem same pojawiają się na liście wyboru.
- Puste dni nie są zapisywane.

---

## 🛠️ Decyzje techniczne

| Decyzja | Jak to działa | Dlaczego |
| --- | --- | --- |
| ⚛️ **React 19 + TypeScript + Vite** | Komponenty funkcyjne, ścisłe typy, szybki serwer deweloperski | Standard rynkowy, błędy w danych wychodzą już przy kompilacji |
| 🎯 **Jedno źródło prawdy** | Zasady i treści żyją w `src/config/*`, ekrany tylko je czytają. Np. ta sama `calculateScore` liczy wynik na „Dziś”, w kalendarzu, tabeli i odznakach | Zmiana zasady w jednym miejscu zmienia całą aplikację, bez rozjazdów |
| 🧮 **Liczymy, nie zapisujemy** | Wynik, kolory, serie, odznaki, wykresy i lista własnych pozycji są wyliczane z zapisanych dni | Baza trzyma tylko fakty („co zjedzone”), więc nic nie może się rozsynchronizować |
| 🗄️ **Baza = plik JSON + mini API we wtyczce Vite** | `server/database.ts` obsługuje `GET` i `PATCH /api/db` w ramach `npm run dev` | Zero osobnego backendu i instalacji, a dane da się podejrzeć w zwykłym pliku |
| 🔁 **Wspólna zasada łączenia zmian** | `data/changes.ts` jest używane przez serwer i przez aplikację | Ekran od razu pokazuje dokładnie to, co zapisze serwer |
| ⚡ **Autozapis optymistyczny** | `store.tsx` (React Context) najpierw aktualizuje ekran, potem wysyła `PATCH` | Brak przycisku „Zapisz”, a interfejs reaguje natychmiast |
| 🧠 **React Context zamiast Redux** | Jeden `useStore()` z danymi, trybem i akcjami | Mała aplikacja, a dodatkowa biblioteka nic by nie dała |
| 📅 **Dni jako klucze `RRRR-MM-DD` w czasie lokalnym** | `useClock` co 30 s sprawdza datę | Prosta zmiana dnia o północy i czytelny plik bazy |
| 🎨 **Tailwind CSS v4 + tokeny marki** | Kolory w `@theme` w `index.css` (`bg-brand`, `text-brand-ink`…) | Jeden plik wyglądu; kontrast sprawdzony (czarny na zieleni 11,6:1) |
| 📊 **Własne wykresy w SVG** | Wycinki pierścieni rysowane ścieżkami SVG, jeden odcień zieleni, dymki po najechaniu, opis dla czytników ekranu | Wykresu pierścieniowego nie ma w typowych bibliotekach, a własny kod jest mały i w pełni kontrolowany |
| 💬 **Dymki przez portal** | `createPortal` + pozycja przycięta do ekranu; mysz otwiera najechaniem, dotyk stuknięciem | Działają też w tabeli i przy krawędziach ekranu, na komputerze i na telefonie |
| 🔤 **Font lokalnie (`@fontsource/poppins`)** | Pliki fontu w paczce aplikacji | Brak zapytań do Google, działa offline, lepsza prywatność |
| 🖼️ **Ikony** | Produkty: PNG z `ikonki/` jako katalog publiczny Vite (bez kopiowania); interfejs: `lucide-react` | Zero duplikatów plików; do paczki trafiają tylko użyte ikony |
| 🎉 **Animacje w czystym CSS** | `@keyframes` w `index.css` | Bez dodatkowych bibliotek |
| 🧪 **Tryb testowy w adresie** | `lib/testParams.ts` czyta `?intro`, `?demo`, `?hour` | Podgląd każdego ekranu bez grzebania w danych |
| 🔒 **Prywatność** | `data/db.json` w `.gitignore`, brak konta i analityki | Dane zostają na Twoim komputerze |

**Znane ograniczenia:**

- brak testów automatycznych,
- baza w pliku działa tylko lokalnie (na Vercelu trzeba ją wymienić, zob. roadmapę),
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

**🔜 Dalej**

- [ ] 🌐 Wersja online na Vercelu (najpierw dane w przeglądarce, potem konto i synchronizacja)
- [ ] 🧪 Testy (Vitest, Testing Library, Playwright) i CI na GitHub Actions
- [ ] 📲 PWA: instalacja na telefonie, działanie offline, powiadomienia push
- [ ] 📆 Podsumowanie tygodnia i przypomnienie w kalendarzu telefonu (.ics)
- [ ] 🐟 Nowe kategorie: ryby, mięso, jajka, zdrowe tłuszcze, zdrowe węglowodany, woda
- [ ] 🍕 Kategoria „ograniczaj”: fast food, białe pieczywo, pizza, tosty, słodkie napoje (odejmuje punkty)
- [ ] 🗑️ Usuwanie danych demo jednym kliknięciem
