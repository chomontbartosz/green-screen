// LISTA OWOCÓW I WARZYW — jedyne miejsce, gdzie je definiujemy.
// Każda pozycja: nazwa, kolor (grupy kolorów: config/balance.ts), sezon w Polsce (orientacyjnie, z przechowywaniem
// warzyw korzeniowych i jabłek), ikona (plik z folderu ikonki/), jedno zdanie „dlaczego warto” i zawartość składników
// w skali 1–5 (nazwy składników i skala: config/nutrients.ts). Brak składnika = śladowa ilość.
// Własne pozycje użytkownika dostają szarą ikonkę.

import type { Days, Group } from '../types'
import type { Color } from './balance'
import type { Level, Nutrient } from './nutrients'

export type Produce = {
  name: string
  color: Color
  season: number[] // miesiące sezonu w Polsce (1 = styczeń); [] = owoc/warzywo z importu, w sklepach cały rok
  icon: string
  about: string
  nutrients: Partial<Record<Nutrient, Level>>
}

export const GROUPS: Record<Group, { label: string; singular: string; genitive: string; placeholder: string }> = {
  vegetables: { label: 'Warzywa', singular: 'Warzywo', genitive: 'warzyw', placeholder: 'Wybierz lub wpisz warzywo…' },
  fruits: { label: 'Owoce', singular: 'Owoc', genitive: 'owoców', placeholder: 'Wybierz lub wpisz owoc…' },
}

export const GROUP_ORDER: Group[] = ['vegetables', 'fruits']

export const PRODUCE: Record<Group, Produce[]> = {
  vegetables: [
    { name: 'Marchew', color: 'orange', season: [6, 7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '21_carrot.png', about: 'Beta-karoten zamienia się w witaminę A, która dba o wzrok i skórę.', nutrients: { witA: 5, blonnik: 3, witB: 2, witK: 2, potas: 2 } },
    { name: 'Pomidor', color: 'red', season: [7, 8, 9], icon: '22_tomato.png', about: 'Likopen z pomidorów lepiej się wchłania z odrobiną oliwy.', nutrients: { witC: 3, witA: 2, witK: 2, potas: 2, foliany: 1, witE: 1 } },
    { name: 'Ogórek', color: 'green', season: [6, 7, 8, 9], icon: '23_cucumber.png', about: 'W 95% to woda — lekki i nawadniający dodatek do każdego posiłku.', nutrients: { witK: 3, witC: 1, potas: 1, magnez: 1 } },
    { name: 'Ziemniak', color: 'white', season: [7, 8, 9, 10, 11, 12, 1, 2, 3, 4], icon: '24_potato.png', about: 'Dobre źródło potasu, ale w wielu zaleceniach nie liczy się do porcji warzyw.', nutrients: { witB: 3, witC: 3, potas: 3, magnez: 2, blonnik: 2, zelazo: 1 } },
    { name: 'Kalafior', color: 'white', season: [6, 7, 8, 9, 10], icon: '25_cauliflower.png', about: 'Garść kalafiora pokrywa połowę dziennej potrzeby witaminy C.', nutrients: { witC: 5, foliany: 3, witK: 3, witB: 2, potas: 2, blonnik: 2 } },
    { name: 'Brokuł', color: 'green', season: [6, 7, 8, 9, 10], icon: '26_broccoli.png', about: 'Jedno z najbardziej odżywczych warzyw — witaminy C i K w dużej ilości.', nutrients: { witC: 5, witK: 5, foliany: 4, blonnik: 3, witA: 2, witB: 2, witE: 2, potas: 2, wapn: 2, zelazo: 2, mangan: 2 } },
    { name: 'Grzyby', color: 'white', season: [8, 9, 10], icon: '27_mushroom.png', about: 'Niskokaloryczne źródło witamin z grupy B; te z dostępem do słońca mają też witaminę D.', nutrients: { witB: 4, potas: 3, witD: 2, foliany: 1, zelazo: 1 } },
    { name: 'Por', color: 'green', season: [8, 9, 10, 11, 12, 1, 2, 3], icon: '28_leek.png', about: 'Łagodny krewny cebuli, bogaty w witaminę K i prebiotyczny błonnik.', nutrients: { witK: 4, witA: 3, foliany: 2, witC: 2, zelazo: 2, mangan: 2, blonnik: 2 } },
    { name: 'Batat', color: 'orange', season: [], icon: '29_sweet_potato.png', about: 'Słodki i sycący, z ogromną dawką beta-karotenu.', nutrients: { witA: 5, potas: 3, mangan: 3, blonnik: 3, witB: 2, witC: 2, magnez: 2 } },
    { name: 'Cebula', color: 'white', season: [7, 8, 9, 10, 11, 12, 1, 2, 3, 4], icon: '30_onion.png', about: 'Kwercetyna i związki siarki wspierają serce i odporność.', nutrients: { witB: 2, witC: 2, blonnik: 2, foliany: 1, potas: 1 } },
    { name: 'Groszek', color: 'green', season: [6, 7], icon: '31_peas.png', about: 'Zielone białko roślinne z dużą ilością błonnika.', nutrients: { witC: 5, blonnik: 5, foliany: 4, witB: 3, witK: 3, witA: 2, magnez: 2, zelazo: 2, mangan: 2 } },
    { name: 'Papryka', color: 'red', season: [7, 8, 9], icon: '32_bell_pepper.png', about: 'Czerwona papryka ma więcej witaminy C niż cytryna.', nutrients: { witC: 5, witA: 4, witB: 3, foliany: 2, witE: 2, potas: 2, blonnik: 2 } },
    { name: 'Kukurydza', color: 'orange', season: [8, 9], icon: '33_corn.png', about: 'Daje energię i luteinę, która chroni oczy.', nutrients: { witB: 3, foliany: 2, potas: 2, magnez: 2, blonnik: 2 } },
    { name: 'Dynia', color: 'orange', season: [9, 10, 11], icon: '34_pumpkin.png', about: 'Pomarańczowy miąższ to beta-karoten przy bardzo niskiej kaloryczności.', nutrients: { witA: 5, witC: 2, witE: 2, potas: 2, witB: 1 } },
    { name: 'Cukinia', color: 'green', season: [6, 7, 8, 9], icon: '35_zucchini.png', about: 'Lekka i uniwersalna — pasuje do makaronu, zupy i na patelnię.', nutrients: { witC: 3, witB: 2, foliany: 2, potas: 2, mangan: 2, witK: 1 } },
    { name: 'Kapusta', color: 'green', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '36_cabbage.png', about: 'Tania i sezonowa przez cały rok; kiszona wspiera jelita.', nutrients: { witK: 5, witC: 4, foliany: 3, witB: 2, wapn: 2, mangan: 2, blonnik: 2 } },
    { name: 'Rzodkiewka', color: 'red', season: [4, 5, 6, 7, 8, 9], icon: '37_radish.png', about: 'Chrupiąca przekąska z witaminą C i niemal zerem kalorii.', nutrients: { witC: 3, witB: 1, foliany: 1, potas: 1 } },
    { name: 'Szpinak', color: 'green', season: [4, 5, 6, 9, 10], icon: '38_spinach.png', about: 'Zielona bomba: witamina K, foliany i magnez w jednej garści.', nutrients: { witA: 5, foliany: 5, witK: 5, magnez: 4, mangan: 4, witC: 3, potas: 3, wapn: 3, zelazo: 3, witE: 2, blonnik: 2 } },
    { name: 'Czosnek', color: 'white', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '39_garlic.png', about: 'Jemy go niewiele, ale dodaje smaku bez soli i wspiera odporność.', nutrients: { mangan: 5, witB: 4, witC: 3, wapn: 2, zelazo: 1 } },
    { name: 'Burak', color: 'red', season: [7, 8, 9, 10, 11, 12, 1, 2, 3], icon: '40_beetroot.png', about: 'Azotany z buraka wspierają krążenie i wydolność.', nutrients: { foliany: 4, mangan: 3, potas: 2, magnez: 2, blonnik: 2, witC: 1, zelazo: 1 } },
  ],
  fruits: [
    { name: 'Jabłko', color: 'red', season: [8, 9, 10, 11, 12, 1, 2, 3, 4], icon: '01_apple.png', about: 'Pektyny ze skórki karmią dobre bakterie jelitowe — jedz ze skórką.', nutrients: { blonnik: 3, witC: 1, witK: 1, potas: 1 } },
    { name: 'Banan', color: 'white', season: [], icon: '02_banana.png', about: 'Szybka energia i potas — dobry przed i po wysiłku.', nutrients: { witB: 4, potas: 3, witC: 2, magnez: 2, mangan: 2, blonnik: 2 } },
    { name: 'Pomarańcza', color: 'orange', season: [], icon: '03_orange.png', about: 'Jedna pomarańcza pokrywa prawie całą dzienną potrzebę witaminy C.', nutrients: { witC: 5, witB: 2, foliany: 2, potas: 2, wapn: 2, blonnik: 2, witA: 1 } },
    { name: 'Winogrona', color: 'purple', season: [9, 10], icon: '04_grapes.png', about: 'Ciemne odmiany mają w skórce resweratrol — silny przeciwutleniacz.', nutrients: { witK: 2, witB: 1, witC: 1, potas: 1, mangan: 1 } },
    { name: 'Truskawki', color: 'red', season: [5, 6, 7], icon: '05_strawberry.png', about: 'Garść truskawek to więcej witaminy C niż w pomarańczy.', nutrients: { witC: 5, mangan: 3, foliany: 2, blonnik: 2, potas: 1 } },
    { name: 'Cytryna', color: 'orange', season: [], icon: '06_lemon.png', about: 'Sok z cytryny pomaga wchłaniać żelazo z warzyw.', nutrients: { witC: 5, blonnik: 2, potas: 1 } },
    { name: 'Gruszka', color: 'green', season: [8, 9, 10, 11], icon: '07_pear.png', about: 'Jeden z owoców z największą ilością błonnika.', nutrients: { blonnik: 4, witC: 1, witK: 1, potas: 1, mangan: 1 } },
    { name: 'Mandarynka', color: 'orange', season: [], icon: '08_mandarin.png', about: 'Łatwa do obrania przekąska z witaminą C.', nutrients: { witC: 4, witA: 2, blonnik: 2, foliany: 1, potas: 1 } },
    { name: 'Kiwi', color: 'green', season: [], icon: '09_kiwi.png', about: 'Jedno kiwi pokrywa dzienną potrzebę witaminy C i wspiera trawienie.', nutrients: { witC: 5, witK: 4, blonnik: 3, foliany: 2, witE: 2, potas: 2, magnez: 1 } },
    { name: 'Borówki', color: 'purple', season: [7, 8, 9], icon: '10_blueberries.png', about: 'Antocyjany z borówek wspierają naczynia krwionośne i pamięć.', nutrients: { witK: 3, mangan: 3, witC: 2, blonnik: 2, witE: 1 } },
    { name: 'Arbuz', color: 'red', season: [], icon: '11_watermelon.png', about: 'Orzeźwia i nawadnia, a przy tym ma likopen jak pomidor.', nutrients: { witA: 2, witC: 2, potas: 1, magnez: 1 } },
    { name: 'Awokado', color: 'green', season: [], icon: '12_avocado.png', about: 'Zdrowe tłuszcze pomagają wchłaniać witaminy A, D, E i K z innych produktów.', nutrients: { blonnik: 5, foliany: 4, witB: 3, witE: 3, witK: 3, potas: 3, witC: 2, magnez: 2 } },
    { name: 'Brzoskwinia', color: 'orange', season: [8], icon: '13_peach.png', about: 'Soczysta i lekka, z odrobiną beta-karotenu.', nutrients: { witA: 2, witC: 2, blonnik: 2, witE: 1, potas: 1 } },
    { name: 'Mango', color: 'orange', season: [], icon: '14_mango.png', about: 'Tropikalna dawka witamin C i A.', nutrients: { witC: 4, witA: 3, foliany: 3, witB: 2, witE: 2, blonnik: 2, witK: 1 } },
    { name: 'Maliny', color: 'red', season: [6, 7, 8, 9], icon: '15_raspberry.png', about: 'Rekordzistki błonnika wśród owoców.', nutrients: { mangan: 5, blonnik: 5, witC: 4, witK: 2, magnez: 2, foliany: 1, witE: 1 } },
    { name: 'Morela', color: 'orange', season: [7, 8], icon: '16_apricot.png', about: 'Świeża lub suszona — źródło beta-karotenu i potasu.', nutrients: { witA: 3, witC: 2, potas: 2, blonnik: 2, witE: 1 } },
    { name: 'Granat', color: 'red', season: [], icon: '17_pomegranate.png', about: 'Pestki granatu są pełne polifenoli, które wspierają serce.', nutrients: { witK: 3, foliany: 2, witC: 2, potas: 2, blonnik: 2 } },
    { name: 'Kokos', color: 'white', season: [], icon: '18_coconut.png', about: 'Dużo tłuszczu nasyconego — traktuj jako dodatek, nie bazę.', nutrients: { mangan: 5, blonnik: 4, potas: 2, magnez: 2, zelazo: 2, witB: 1 } },
    { name: 'Śliwka', color: 'purple', season: [8, 9, 10], icon: '19_plum.png', about: 'Świeża i suszona naturalnie wspiera trawienie.', nutrients: { witC: 2, witK: 2, blonnik: 2, witA: 1, potas: 1 } },
    { name: 'Ananas', color: 'orange', season: [], icon: '20_pineapple.png', about: 'Bromelaina z ananasa wspiera trawienie białka.', nutrients: { witC: 5, mangan: 5, witB: 2, foliany: 1, blonnik: 1 } },
  ],
}

/** Znajduje produkt po nazwie. Brak wyniku = własna pozycja użytkownika. */
export const findProduce = (group: Group, name: string) => PRODUCE[group].find((p) => p.name === name)

/** Lista do wyboru: produkty z konfiguracji + własne pozycje, które użytkownik kiedykolwiek wpisał. */
export function productNames(group: Group, days: Days): string[] {
  const builtIn = PRODUCE[group].map((p) => p.name)
  const custom = Object.values(days).flatMap((day) => day[group].map((item) => item.name))
  return [...new Set([...builtIn, ...custom])]
}
