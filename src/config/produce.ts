// LISTA OWOCÓW I WARZYW — jedyne miejsce, gdzie je definiujemy.
// Każda pozycja: nazwa, kolor (grupy kolorów: config/balance.ts), sezon w Polsce (orientacyjnie, z przechowywaniem
// warzyw korzeniowych i jabłek), ikona (plik z folderu ikonki/), jedno zdanie „dlaczego warto” i zawartość składników
// w skali 1–5 (nazwy składników i skala: config/nutrients.ts). Brak składnika = śladowa ilość.
// Kiszonki: sezon jesień–wiosna, kiedy brakuje świeżych warzyw.
// Własne pozycje użytkownika dostają szarą ikonkę.

import type { DayEntry, Days, Group } from '../types'
import type { Color } from './balance'
import type { Level, Nutrient } from './nutrients'

/** Znaczniki: strączki liczą się maks. 1 porcja dziennie (config/scoring.ts); kiszonka, liściaste, egzotyczne — do odznak
 * (config/achievements.ts); suszone — owoce suszone (porcja 30 g). */
export type Tag = 'kiszonka' | 'strączki' | 'suszone' | 'liściaste' | 'egzotyczne'

export type Produce = {
  name: string
  color: Color
  tags?: Tag[]
  portionGrams?: number // gramy na 1 porcję, jeśli inne niż standardowe 80 g (suszone owoce: 30 g)
  season: number[] // miesiące sezonu w Polsce (1 = styczeń); [] = cały rok w sklepach (import lub suszone strączki)
  icon: string // plik z ikonki/; jeśli go jeszcze nie ma, pokazuje się kolorowe kółko z literą
  about: string
  nutrients: Partial<Record<Nutrient, Level>>
}

export const GROUPS: Record<Group, { label: string; singular: string; genitive: string; placeholder: string }> = {
  vegetables: { label: 'Warzywa', singular: 'Warzywo', genitive: 'warzyw', placeholder: 'Wybierz lub wpisz warzywo…' },
  fruits: { label: 'Owoce', singular: 'Owoc', genitive: 'owoców', placeholder: 'Wybierz lub wpisz owoc…' },
}

export const GROUP_ORDER: Group[] = ['vegetables', 'fruits']

// Kolejność = kolejność na liście wyboru i w Bazie wiedzy (pogrupowane tematycznie, bez nagłówków na ekranie).
export const PRODUCE: Record<Group, Produce[]> = {
  vegetables: [
    // liściaste
    { name: 'Sałata', color: 'green', tags: ['liściaste'], season: [4, 5, 6, 7, 8, 9, 10], icon: '41_lettuce.png', about: 'Lekka baza każdej sałatki — witamina K i foliany przy minimum kalorii.', nutrients: { witK: 5, witA: 4, foliany: 3, witC: 2, potas: 1, blonnik: 1 } },
    { name: 'Roszponka', color: 'green', tags: ['liściaste'], season: [9, 10, 11, 12, 1, 2, 3, 4], icon: '42_lambs_lettuce.png', about: 'Zimowa sałata o orzechowym smaku, z żelazem i witaminą C, która pomaga je wchłaniać.', nutrients: { witA: 5, witC: 4, foliany: 3, zelazo: 3, witB: 2, potas: 2, mangan: 2 } },
    { name: 'Rukola', color: 'green', tags: ['liściaste'], season: [5, 6, 7, 8, 9, 10], icon: '43_arugula.png', about: 'Pikantne liście z dużą dawką witaminy K i azotanów, które wspierają ciśnienie.', nutrients: { witK: 5, witA: 3, foliany: 2, witC: 2, wapn: 2 } },
    { name: 'Szpinak', color: 'green', tags: ['liściaste'], season: [4, 5, 6, 9, 10], icon: '38_spinach.png', about: 'Zielona bomba: witamina K, foliany i magnez w jednej garści.', nutrients: { witA: 5, foliany: 5, witK: 5, magnez: 4, mangan: 4, witC: 3, potas: 3, wapn: 3, zelazo: 3, witE: 2, blonnik: 2 } },
    { name: 'Jarmuż', color: 'green', tags: ['liściaste'], season: [9, 10, 11, 12, 1, 2], icon: '44_kale.png', about: 'Zielony rekordzista: witamin K, C i A ma więcej niż większość zieleniny.', nutrients: { witK: 5, witC: 5, witA: 5, mangan: 4, wapn: 3, witB: 2, potas: 2, blonnik: 2 } },
    // kapustne
    { name: 'Kapusta', color: 'green', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '36_cabbage.png', about: 'Tania i sezonowa przez cały rok; kiszona wspiera jelita.', nutrients: { witK: 5, witC: 4, foliany: 3, witB: 2, wapn: 2, mangan: 2, blonnik: 2 } },
    { name: 'Kapusta czerwona', color: 'purple', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '45_red_cabbage.png', about: 'Fioletowa dzięki antocyjanom, a witaminy C ma prawie dwa razy więcej niż biała.', nutrients: { witC: 5, witK: 3, witA: 2, witB: 2, potas: 2, mangan: 2, blonnik: 2 } },
    { name: 'Kapusta kiszona', color: 'white', tags: ['kiszonka'], season: [9, 10, 11, 12, 1, 2, 3, 4], icon: '46_sauerkraut.png', about: 'Polska klasyka: naturalnie kiszona daje bakterie probiotyczne i witaminę C. Też dość słona.', nutrients: { witC: 3, witK: 2, zelazo: 2, blonnik: 2, mangan: 1 } },
    { name: 'Brukselka', color: 'green', season: [9, 10, 11, 12, 1, 2], icon: '47_brussels_sprouts.png', about: 'Mała kapusta, duża dawka witamin K i C. Najsmaczniejsza po pierwszych przymrozkach.', nutrients: { witK: 5, witC: 5, foliany: 3, blonnik: 3, witA: 2, witB: 2, potas: 2, mangan: 2 } },
    { name: 'Kalafior', color: 'white', season: [6, 7, 8, 9, 10], icon: '25_cauliflower.png', about: 'Garść kalafiora pokrywa połowę dziennej potrzeby witaminy C.', nutrients: { witC: 5, foliany: 3, witK: 3, witB: 2, potas: 2, blonnik: 2 } },
    { name: 'Brokuł', color: 'green', season: [6, 7, 8, 9, 10], icon: '26_broccoli.png', about: 'Jedno z najbardziej odżywczych warzyw — witaminy C i K w dużej ilości.', nutrients: { witC: 5, witK: 5, foliany: 4, blonnik: 3, witA: 2, witB: 2, witE: 2, potas: 2, wapn: 2, zelazo: 2, mangan: 2 } },
    { name: 'Kalarepa', color: 'white', season: [5, 6, 7, 8, 9, 10], icon: '48_kohlrabi.png', about: 'Na surowo chrupie jak jabłko, a witaminy C ma więcej niż pomarańcza.', nutrients: { witC: 5, witB: 2, potas: 2, blonnik: 2 } },
    // korzeniowe i bulwy
    { name: 'Marchew', color: 'orange', season: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '21_carrot.png', about: 'Beta-karoten zamienia się w witaminę A, która dba o wzrok i skórę.', nutrients: { witA: 5, blonnik: 3, witB: 2, witK: 2, potas: 2 } },
    { name: 'Burak', color: 'red', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '40_beetroot.png', about: 'Azotany z buraka wspierają krążenie i wydolność.', nutrients: { foliany: 4, mangan: 3, potas: 2, magnez: 2, blonnik: 2, witC: 1, zelazo: 1 } },
    { name: 'Rzodkiewka', color: 'red', season: [4, 5, 6, 7, 8, 9], icon: '37_radish.png', about: 'Chrupiąca przekąska z witaminą C i niemal zerem kalorii.', nutrients: { witC: 3, witB: 1, foliany: 1, potas: 1 } },
    { name: 'Ziemniak', color: 'white', season: [7, 8, 9, 10, 11, 12, 1, 2, 3, 4], icon: '24_potato.png', about: 'Dobre źródło potasu, ale w wielu zaleceniach nie liczy się do porcji warzyw.', nutrients: { witB: 3, witC: 3, potas: 3, magnez: 2, blonnik: 2, zelazo: 1 } },
    { name: 'Batat', color: 'orange', season: [], icon: '29_sweet_potato.png', about: 'Słodki i sycący, z ogromną dawką beta-karotenu.', nutrients: { witA: 5, potas: 3, mangan: 3, blonnik: 3, witB: 2, witC: 2, magnez: 2 } },
    // cebulowe
    { name: 'Cebula', color: 'white', season: [7, 8, 9, 10, 11, 12, 1, 2, 3, 4], icon: '30_onion.png', about: 'Kwercetyna i związki siarki wspierają serce i odporność.', nutrients: { witB: 2, witC: 2, blonnik: 2, foliany: 1, potas: 1 } },
    { name: 'Por', color: 'green', season: [8, 9, 10, 11, 12, 1, 2, 3], icon: '28_leek.png', about: 'Łagodny krewny cebuli, bogaty w witaminę K i prebiotyczny błonnik.', nutrients: { witK: 4, witA: 3, foliany: 2, witC: 2, zelazo: 2, mangan: 2, blonnik: 2 } },
    { name: 'Czosnek', color: 'white', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '39_garlic.png', about: 'Jemy go niewiele, ale dodaje smaku bez soli i wspiera odporność.', nutrients: { mangan: 5, witB: 4, witC: 3, wapn: 2, zelazo: 1 } },
    // psiankowate i dyniowate
    { name: 'Pomidor', color: 'red', season: [7, 8, 9], icon: '22_tomato.png', about: 'Likopen z pomidorów lepiej się wchłania z odrobiną oliwy.', nutrients: { witC: 3, witA: 2, witK: 2, potas: 2, foliany: 1, witE: 1 } },
    { name: 'Papryka', color: 'red', season: [7, 8, 9], icon: '32_bell_pepper.png', about: 'Czerwona papryka ma więcej witaminy C niż cytryna.', nutrients: { witC: 5, witA: 4, witB: 3, foliany: 2, witE: 2, potas: 2, blonnik: 2 } },
    { name: 'Bakłażan', color: 'purple', season: [7, 8, 9], icon: '49_eggplant.png', about: 'Fioletowa skórka to antocyjany — nie obieraj go.', nutrients: { mangan: 2, blonnik: 2, witK: 1, potas: 1 } },
    { name: 'Ogórek', color: 'green', season: [6, 7, 8, 9], icon: '23_cucumber.png', about: 'W 95% to woda — lekki i nawadniający dodatek do każdego posiłku.', nutrients: { witK: 3, witC: 1, potas: 1, magnez: 1 } },
    { name: 'Ogórek kiszony', color: 'green', tags: ['kiszonka'], season: [9, 10, 11, 12, 1, 2, 3, 4], icon: '50_pickled_cucumber.png', about: 'Naturalnie kiszony to żywe bakterie dla jelit. Ma sporo soli, więc z umiarem.', nutrients: { witK: 3, witA: 1, potas: 1, blonnik: 1 } },
    { name: 'Cukinia', color: 'green', season: [6, 7, 8, 9], icon: '35_zucchini.png', about: 'Lekka i uniwersalna — pasuje do makaronu, zupy i na patelnię.', nutrients: { witC: 3, witB: 2, foliany: 2, potas: 2, mangan: 2, witK: 1 } },
    { name: 'Dynia', color: 'orange', season: [9, 10, 11], icon: '34_pumpkin.png', about: 'Pomarańczowy miąższ to beta-karoten przy bardzo niskiej kaloryczności.', nutrients: { witA: 5, witC: 2, witE: 2, potas: 2, witB: 1 } },
    // strączkowe
    { name: 'Groszek', color: 'green', season: [6, 7], icon: '31_peas.png', about: 'Zielone białko roślinne z dużą ilością błonnika.', nutrients: { witC: 5, blonnik: 5, foliany: 4, witB: 3, witK: 3, witA: 2, magnez: 2, zelazo: 2, mangan: 2 } },
    { name: 'Fasolka szparagowa', color: 'green', season: [7, 8, 9], icon: '51_green_beans.png', about: 'Chrupiąca zieleń z błonnikiem i witaminą K — najlepsza z parowaru.', nutrients: { witK: 3, witA: 2, witC: 2, foliany: 2, mangan: 2, blonnik: 2 } },
    { name: 'Fasola', color: 'white', tags: ['strączki'], season: [], icon: '52_kidney_beans.png', about: 'Roślinne białko i rekordowa ilość błonnika. Strączki liczą się maks. 1 porcja dziennie.', nutrients: { blonnik: 5, foliany: 4, zelazo: 3, magnez: 3, potas: 3, mangan: 3, witB: 2 } },
    { name: 'Ciecierzyca', color: 'white', tags: ['strączki'], season: [], icon: '53_chickpeas.png', about: 'Baza hummusu: białko, błonnik i foliany. Strączki liczą się maks. 1 porcja dziennie.', nutrients: { blonnik: 5, foliany: 5, mangan: 4, zelazo: 3, witB: 2, magnez: 2, potas: 2 } },
    { name: 'Soczewica', color: 'white', tags: ['strączki'], season: [], icon: '54_lentils.png', about: 'Gotuje się w 15 minut i ma najwięcej żelaza z popularnych strączków. Liczy się maks. 1 porcja dziennie.', nutrients: { blonnik: 5, foliany: 5, zelazo: 4, mangan: 4, witB: 3, potas: 3, magnez: 2 } },
    // inne
    { name: 'Kukurydza', color: 'orange', season: [8, 9], icon: '33_corn.png', about: 'Daje energię i luteinę, która chroni oczy.', nutrients: { witB: 3, foliany: 2, potas: 2, magnez: 2, blonnik: 2 } },
    { name: 'Szparagi', color: 'green', season: [5, 6], icon: '55_asparagus.png', about: 'Wiosenny przysmak bogaty w foliany. Polski sezon kończy się w czerwcu.', nutrients: { foliany: 4, witK: 4, witA: 2, witC: 2, witE: 2, zelazo: 2, blonnik: 2 } },
    { name: 'Grzyby', color: 'white', season: [8, 9, 10], icon: '27_mushroom.png', about: 'Niskokaloryczne źródło witamin z grupy B; te z dostępem do słońca mają też witaminę D.', nutrients: { witB: 4, potas: 3, witD: 2, foliany: 1, zelazo: 1 } },
    { name: 'Imbir', color: 'white', season: [], icon: '56_ginger.png', about: 'Rozgrzewa i łagodzi mdłości. Jemy go niewiele, więc to raczej przyprawa niż pełna porcja.', nutrients: { mangan: 2, potas: 1, magnez: 1, witB: 1 } },
  ],
  fruits: [
    // jabłkowate
    { name: 'Jabłko', color: 'red', season: [8, 9, 10, 11, 12, 1, 2, 3, 4], icon: '01_apple.png', about: 'Pektyny ze skórki karmią dobre bakterie jelitowe — jedz ze skórką.', nutrients: { blonnik: 3, witC: 1, witK: 1, potas: 1 } },
    { name: 'Gruszka', color: 'green', season: [8, 9, 10, 11], icon: '07_pear.png', about: 'Jeden z owoców z największą ilością błonnika.', nutrients: { blonnik: 4, witC: 1, witK: 1, potas: 1, mangan: 1 } },
    // cytrusy
    { name: 'Pomarańcza', color: 'orange', season: [], icon: '03_orange.png', about: 'Jedna pomarańcza pokrywa prawie całą dzienną potrzebę witaminy C.', nutrients: { witC: 5, witB: 2, foliany: 2, potas: 2, wapn: 2, blonnik: 2, witA: 1 } },
    { name: 'Mandarynka', color: 'orange', season: [], icon: '08_mandarin.png', about: 'Łatwa do obrania przekąska z witaminą C.', nutrients: { witC: 4, witA: 2, blonnik: 2, foliany: 1, potas: 1 } },
    { name: 'Grejpfrut', color: 'red', season: [], icon: '57_grapefruit.png', about: 'Połówka to porcja z dużą dawką witaminy C. Uwaga: grejpfrut wchodzi w interakcje z częścią leków.', nutrients: { witC: 5, witA: 2, blonnik: 2, potas: 1 } },
    { name: 'Pomelo', color: 'orange', tags: ['egzotyczne'], season: [], icon: '73_pomelo.png', about: 'Największy cytrus: łagodniejszy od grejpfruta, z dużą dawką witaminy C. Tak jak grejpfrut może wchodzić w interakcje z lekami.', nutrients: { witC: 5, potas: 2, blonnik: 1 } },
    { name: 'Cytryna', color: 'orange', season: [], icon: '06_lemon.png', about: 'Sok z cytryny pomaga wchłaniać żelazo z warzyw.', nutrients: { witC: 5, blonnik: 2, potas: 1 } },
    // jagodowe i krzewy
    { name: 'Truskawki', color: 'red', season: [5, 6, 7], icon: '05_strawberry.png', about: 'Garść truskawek to więcej witaminy C niż w pomarańczy.', nutrients: { witC: 5, mangan: 3, foliany: 2, blonnik: 2, potas: 1 } },
    { name: 'Maliny', color: 'red', season: [6, 7, 8, 9], icon: '15_raspberry.png', about: 'Rekordzistki błonnika wśród owoców.', nutrients: { mangan: 5, blonnik: 5, witC: 4, witK: 2, magnez: 2, foliany: 1, witE: 1 } },
    { name: 'Jeżyny', color: 'purple', season: [7, 8, 9], icon: '58_blackberries.png', about: 'Te same antocyjany co borówki, a błonnika jeszcze więcej.', nutrients: { mangan: 4, blonnik: 4, witC: 3, witK: 3, witE: 1, foliany: 1 } },
    { name: 'Borówki', color: 'purple', season: [7, 8, 9], icon: '10_blueberries.png', about: 'Antocyjany z borówek wspierają naczynia krwionośne i pamięć.', nutrients: { witK: 3, mangan: 3, witC: 2, blonnik: 2, witE: 1 } },
    { name: 'Porzeczki czarne', color: 'purple', season: [7], icon: '59_blackcurrants.png', about: 'Polska rekordzistka witaminy C — garść pokrywa dzienną potrzebę z nawiązką.', nutrients: { witC: 5, mangan: 3, blonnik: 3, potas: 2, witE: 1, zelazo: 1 } },
    { name: 'Porzeczki czerwone', color: 'red', season: [7], icon: '60_redcurrants.png', about: 'Kwaskowe korale z dużą ilością witaminy C i błonnika.', nutrients: { witC: 5, blonnik: 3, mangan: 2, witK: 1 } },
    { name: 'Agrest', color: 'green', season: [6, 7], icon: '61_gooseberries.png', about: 'Kwaśny, chrupiący i trochę zapomniany polski klasyk z witaminą C.', nutrients: { witC: 4, blonnik: 3, witA: 1, mangan: 1 } },
    { name: 'Aronia', color: 'purple', season: [8, 9], icon: '62_chokeberries.png', about: 'Cierpka polska jagoda z wyjątkowo dużą ilością antocyjanów. Najlepsza w koktajlu albo suszona.', nutrients: { blonnik: 4, witC: 2, witK: 2, mangan: 2 } },
    // winogrona
    { name: 'Winogrona ciemne', color: 'purple', season: [9, 10], icon: '04_grapes.png', about: 'W ciemnej skórce są antocyjany i resweratrol — silne przeciwutleniacze.', nutrients: { witK: 2, witB: 1, witC: 1, potas: 1, mangan: 1 } },
    { name: 'Winogrona jasne', color: 'green', season: [9, 10], icon: '63_white_grapes.png', about: 'Słodkie i soczyste. Ciemne odmiany mają w skórce więcej antocyjanów.', nutrients: { witK: 2, witC: 1, potas: 1 } },
    // pestkowe
    { name: 'Wiśnie', color: 'red', season: [7], icon: '64_sour_cherries.png', about: 'Kwaskowe i pełne antocyjanów — świetne do owsianki, także mrożone.', nutrients: { witA: 2, witC: 2, potas: 1, blonnik: 1 } },
    { name: 'Czereśnie', color: 'red', season: [6, 7], icon: '65_sweet_cherries.png', about: 'Słodki symbol polskiego lata; ciemne odmiany mają najwięcej antocyjanów.', nutrients: { witC: 2, potas: 2, blonnik: 2, witK: 1 } },
    { name: 'Śliwka', color: 'purple', season: [8, 9, 10], icon: '19_plum.png', about: 'Świeża i suszona naturalnie wspiera trawienie.', nutrients: { witC: 2, witK: 2, blonnik: 2, witA: 1, potas: 1 } },
    { name: 'Brzoskwinia', color: 'orange', season: [8], icon: '13_peach.png', about: 'Soczysta i lekka, z odrobiną beta-karotenu.', nutrients: { witA: 2, witC: 2, blonnik: 2, witE: 1, potas: 1 } },
    { name: 'Nektarynka', color: 'orange', season: [], icon: '66_nectarine.png', about: 'Gładka kuzynka brzoskwini — te same witaminy, bez meszku.', nutrients: { witC: 2, witA: 2, potas: 1, blonnik: 1 } },
    { name: 'Morela', color: 'orange', season: [7, 8], icon: '16_apricot.png', about: 'Świeża lub suszona — źródło beta-karotenu i potasu.', nutrients: { witA: 3, witC: 2, potas: 2, blonnik: 2, witE: 1 } },
    // egzotyczne
    { name: 'Banan', color: 'white', tags: ['egzotyczne'], season: [], icon: '02_banana.png', about: 'Szybka energia i potas — dobry przed i po wysiłku.', nutrients: { witB: 4, potas: 3, witC: 2, magnez: 2, mangan: 2, blonnik: 2 } },
    { name: 'Kiwi', color: 'green', tags: ['egzotyczne'], season: [], icon: '09_kiwi.png', about: 'Jedno kiwi pokrywa dzienną potrzebę witaminy C i wspiera trawienie.', nutrients: { witC: 5, witK: 4, blonnik: 3, foliany: 2, witE: 2, potas: 2, magnez: 1 } },
    { name: 'Mango', color: 'orange', tags: ['egzotyczne'], season: [], icon: '14_mango.png', about: 'Tropikalna dawka witamin C i A.', nutrients: { witC: 4, witA: 3, foliany: 3, witB: 2, witE: 2, blonnik: 2, witK: 1 } },
    { name: 'Ananas', color: 'orange', tags: ['egzotyczne'], season: [], icon: '20_pineapple.png', about: 'Bromelaina z ananasa wspiera trawienie białka.', nutrients: { witC: 5, mangan: 5, witB: 2, foliany: 1, blonnik: 1 } },
    { name: 'Awokado', color: 'green', tags: ['egzotyczne'], season: [], icon: '12_avocado.png', about: 'Zdrowe tłuszcze pomagają wchłaniać witaminy A, D, E i K z innych produktów.', nutrients: { blonnik: 5, foliany: 4, witB: 3, witE: 3, witK: 3, potas: 3, witC: 2, magnez: 2 } },
    { name: 'Granat', color: 'red', tags: ['egzotyczne'], season: [], icon: '17_pomegranate.png', about: 'Pestki granatu są pełne polifenoli, które wspierają serce.', nutrients: { witK: 3, foliany: 2, witC: 2, potas: 2, blonnik: 2 } },
    { name: 'Kaki', color: 'orange', tags: ['egzotyczne'], season: [], icon: '67_persimmon.png', about: 'Jesienny owoc o smaku miodu; dojrzały jest miękki jak galaretka.', nutrients: { witA: 3, mangan: 3, blonnik: 3, witC: 2 } },
    { name: 'Kokos', color: 'white', tags: ['egzotyczne'], season: [], icon: '18_coconut.png', about: 'Dużo tłuszczu nasyconego — traktuj jako dodatek, nie bazę.', nutrients: { mangan: 5, blonnik: 4, potas: 2, magnez: 2, zelazo: 2, witB: 1 } },
    // melony
    { name: 'Arbuz', color: 'red', season: [], icon: '11_watermelon.png', about: 'Orzeźwia i nawadnia, a przy tym ma likopen jak pomidor.', nutrients: { witA: 2, witC: 2, potas: 1, magnez: 1 } },
    { name: 'Melon', color: 'orange', season: [], icon: '68_melon.png', about: 'Pomarańczowy miąższ to beta-karoten i witamina C, a przy tym głównie woda.', nutrients: { witC: 4, witA: 3, potas: 2, foliany: 1 } },
    // suszone (porcja ok. 30 g)
    { name: 'Rodzynki', color: 'white', tags: ['suszone'], portionGrams: 30, season: [], icon: '69_raisins.png', about: 'Skoncentrowana słodycz: mała garść (30 g) to porcja. Najlepiej do posiłku, nie do podjadania.', nutrients: { potas: 2, blonnik: 1, zelazo: 1, mangan: 1, witB: 1 } },
    { name: 'Żurawina suszona', color: 'red', tags: ['suszone'], portionGrams: 30, season: [], icon: '70_dried_cranberries.png', about: 'Zwykle dosładzana — szukaj bez dodatku cukru. Porcja to ok. 30 g.', nutrients: { blonnik: 2, witE: 1, mangan: 1 } },
    { name: 'Daktyle', color: 'white', tags: ['suszone', 'egzotyczne'], portionGrams: 30, season: [], icon: '71_dates.png', about: 'Naturalny słodzik do koktajli i owsianki. Porcja to 2–3 sztuki (ok. 30 g).', nutrients: { potas: 2, blonnik: 2, magnez: 1, mangan: 1, witB: 1 } },
    { name: 'Figi suszone', color: 'white', tags: ['suszone'], portionGrams: 30, season: [], icon: '72_dried_figs.png', about: 'Wśród owoców wyróżniają się wapniem i błonnikiem. Porcja to 2–3 sztuki (ok. 30 g).', nutrients: { blonnik: 3, wapn: 2, potas: 2, magnez: 1, mangan: 1, witK: 1 } },
  ],
}

/** Znajduje produkt po nazwie. Brak wyniku = własna pozycja użytkownika. */
export const findProduce = (group: Group, name: string) => PRODUCE[group].find((p) => p.name === name)

/** Wszystkie produkty z listy razem z grupą (warzywa, potem owoce). */
export const ALL_PRODUCE = GROUP_ORDER.flatMap((group) => PRODUCE[group].map((produce) => ({ group, produce })))

/** Pozycje jednego dnia razem z grupą i produktem z listy (`produce` puste = własna pozycja). */
export const itemsOfDay = (day: DayEntry | undefined) =>
  day ? GROUP_ORDER.flatMap((group) => day[group].map((item) => ({ group, item, produce: findProduce(group, item.name) }))) : []

/** Produkt po nazwie, bez względu na grupę. */
export const findAny = (name: string) => GROUP_ORDER.map((g) => findProduce(g, name)).find(Boolean)

/** Czy produkt (z dowolnej grupy) ma dany znacznik, np. 'kiszonka'. */
export const hasTag = (name: string, tag: Tag) => !!findAny(name)?.tags?.includes(tag)

/** Własne pozycje użytkownika: wszystko z historii, czego nie ma w konfiguracji (bez usuniętych z listy). */
export function customNames(group: Group, days: Days, hidden: string[]): string[] {
  const names = Object.values(days).flatMap((day) => day[group].map((item) => item.name))
  return [...new Set(names)].filter((name) => !findProduce(group, name) && !hidden.includes(name))
}

/** Lista wyboru zaczyna się od najpopularniejszych w Polsce (szybciej je znaleźć), dalej reszta w kolejności tematycznej. */
export const POPULAR: Record<Group, string[]> = {
  vegetables: ['Pomidor', 'Ogórek', 'Marchew', 'Papryka', 'Ziemniak', 'Cebula', 'Brokuł', 'Kalafior', 'Sałata', 'Kapusta', 'Ogórek kiszony', 'Kapusta kiszona', 'Czosnek', 'Burak', 'Cukinia', 'Rzodkiewka', 'Por', 'Szpinak', 'Groszek', 'Kukurydza', 'Grzyby'],
  fruits: ['Jabłko', 'Banan', 'Pomarańcza', 'Mandarynka', 'Truskawki', 'Gruszka', 'Winogrona ciemne', 'Winogrona jasne', 'Śliwka', 'Cytryna', 'Borówki', 'Maliny', 'Kiwi', 'Arbuz', 'Czereśnie', 'Wiśnie', 'Brzoskwinia', 'Nektarynka'],
}

/** Lista do wyboru: popularne → pozostałe produkty z konfiguracji → własne pozycje. */
export function productNames(group: Group, days: Days, hidden: string[]): string[] {
  const rest = PRODUCE[group].map((p) => p.name).filter((name) => !POPULAR[group].includes(name))
  return [...POPULAR[group], ...rest, ...customNames(group, days, hidden)]
}
