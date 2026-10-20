// BALANS — zasada „jedz kolorowo”: jakie kolory, jak często, w jakich ilościach i na jakiej podstawie.
// Każdy produkt ma przypisany kolor w config/produce.ts. Tu są tygodniowe minima, źródła naukowe
// i reguła, która na ekranie „Dziś” podpowiada, czego brakowało w ostatnich dniach.
//
// Jak czytać minima: cel 5 + 5 to 70 porcji tygodniowo. Minima kolorów (razem 21 porcji) to tylko
// „podłoga”, która zapewnia różne grupy związków roślinnych — resztę wybierasz dowolnie.
//
// Dlaczego 5 grup, a nie każdy odcień osobno: grupujemy według BARWNIKÓW (rodzin związków), nie według
// odcienia. Niebieskie borówki i czarne jeżyny mają te same antocyjany, różowy arbuz i czerwony pomidor
// ten sam likopen — więc są w jednej grupie. Liczy się kolor części, którą jemy (banan ma biały miąższ).

import type { DayEntry, Days, Group, Mode } from '../types'
import { pastKeys, shiftKey } from '../lib/date'
import { ALL_PRODUCE, itemsOfDay } from './produce'
import { portions } from './scoring'

export type Color = 'green' | 'red' | 'orange' | 'purple' | 'white'

type Source = { title: string; url: string }

// BADANIA NAUKOWE — pełna lista źródeł, na których opierają się zasady aplikacji (element merytoryczny,
// także te, których ekrany jeszcze nie cytują). Ta sama lista jest w README → „Badania naukowe”.
export const SOURCES = {
  aune2017: { title: 'Aune i in. 2017, Int J Epidemiol — ok. 800 g warzyw i owoców dziennie: najniższe ryzyko chorób serca i przedwczesnej śmierci', url: 'https://doi.org/10.1093/ije/dyw319' },
  wang2021: { title: 'Wang i in. 2021, Circulation — ok. 5 porcji dziennie wiąże się z najniższą śmiertelnością (2 mln uczestników)', url: 'https://doi.org/10.1161/CIRCULATIONAHA.120.048996' },
  who: { title: 'WHO — Healthy diet: co najmniej 400 g warzyw i owoców dziennie', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
  ncez: { title: 'NCEZ (PZH) — Talerz zdrowego żywienia: warzywa i owoce jako połowa każdego posiłku', url: 'https://ncez.pzh.gov.pl/abc-zywienia/talerz-zdrowego-zywienia/' },
  blumfield2022: { title: 'Blumfield i in. 2022, Molecules — przegląd badań o zdrowotnym działaniu barwników roślin („eat a rainbow”)', url: 'https://doi.org/10.3390/molecules27134061' },
  morris2018: { title: 'Morris i in. 2018, Neurology — 1 porcja zielonych liściastych dziennie: wolniejsze starzenie się mózgu', url: 'https://doi.org/10.1212/WNL.0000000000004815' },
  siervo2013: { title: 'Siervo i in. 2013, J Nutr — azotany (burak, zielone liściaste) obniżają ciśnienie krwi', url: 'https://doi.org/10.3945/jn.112.170233' },
  cheng2017: { title: 'Cheng i in. 2017, Atherosclerosis — pomidory i likopen a czynniki ryzyka chorób serca', url: 'https://doi.org/10.1016/j.atherosclerosis.2017.01.009' },
  aune2018: { title: 'Aune i in. 2018, Am J Clin Nutr — witamina C i karotenoidy a ryzyko chorób serca i nowotworów', url: 'https://doi.org/10.1093/ajcn/nqy097' },
  cassidy2013: { title: 'Cassidy i in. 2013, Circulation — min. 3 porcje borówek/truskawek tygodniowo: mniej zawałów u kobiet', url: 'https://doi.org/10.1161/CIRCULATIONAHA.112.122408' },
  mcdonald2018: { title: 'McDonald i in. 2018, mSystems (American Gut) — 30+ różnych roślin tygodniowo: bogatsza mikroflora jelit', url: 'https://doi.org/10.1128/mSystems.00031-18' },
} satisfies Record<string, Source>

export const COLORS: Record<Color, { name: string; few: string; swatch: string; benefit: string; weeklyMin: number; sources: Source[] }> = {
  green: {
    name: 'Zielone',
    few: 'zielonych',
    swatch: 'bg-green-500',
    benefit: 'foliany, witamina K i azotany wspierają mózg i ciśnienie',
    weeklyMin: 7, // 1 porcja dziennie — Morris 2018
    sources: [SOURCES.morris2018, SOURCES.siervo2013],
  },
  red: {
    name: 'Czerwone i różowe',
    few: 'czerwonych i różowych',
    swatch: 'bg-red-500',
    benefit: 'likopen i antocyjany wspierają serce i naczynia',
    weeklyMin: 4, // założenie projektu: co drugi dzień — Cheng 2017, Blumfield 2022
    sources: [SOURCES.cheng2017, SOURCES.blumfield2022],
  },
  orange: {
    name: 'Pomarańczowe i żółte',
    few: 'pomarańczowych i żółtych',
    swatch: 'bg-orange-400',
    benefit: 'beta-karoten i witamina C wspierają wzrok, skórę i odporność',
    weeklyMin: 4, // założenie projektu: co drugi dzień — Aune 2018
    sources: [SOURCES.aune2018, SOURCES.blumfield2022],
  },
  purple: {
    name: 'Fioletowe, niebieskie i czarne',
    few: 'fioletowych, niebieskich i czarnych',
    swatch: 'bg-violet-500',
    benefit: 'antocyjany wspierają serce i pamięć',
    weeklyMin: 3, // min. 3 porcje tygodniowo — Cassidy 2013
    sources: [SOURCES.cassidy2013, SOURCES.blumfield2022],
  },
  white: {
    name: 'Białe, beżowe i brązowe',
    few: 'białych, beżowych i brązowych',
    swatch: 'bg-stone-300',
    benefit: 'kwercetyna i związki siarki wspierają odporność',
    weeklyMin: 3, // założenie projektu — Blumfield 2022
    sources: [SOURCES.blumfield2022],
  },
}

export const COLOR_ORDER: Color[] = ['green', 'red', 'orange', 'purple', 'white']

/** Zasada grupowania kolorów — pokazywana w Bazie wiedzy. */
export const COLOR_RULE =
  'Kolory grupujemy według barwników, nie odcieni: niebieskie borówki i czarne jeżyny mają te same antocyjany, więc są w jednej grupie. Liczy się kolor części, którą jemy — banan ma biały miąższ.'

export const BALANCE = {
  windowDays: 7, // analizujemy 7 pełnych dni przed dzisiaj
  minLoggedDays: 3, // podpowiedzi dopiero, gdy w tym czasie są co najmniej 3 dni z wpisami
  weeklyVariety: 15, // różnych warzyw i owoców w tygodniu (McDonald 2018: 30 roślin, wliczając zboża, orzechy i strączki)
  maxTips: 3, // ile braków pokazać naraz (wiersze jednej karty)
}

/** Kolory zjedzone danego dnia (własne pozycje nie mają koloru). */
export function dayColors(day: DayEntry): Set<Color> {
  return new Set(itemsOfDay(day).flatMap(({ produce }) => produce?.color ?? []))
}

/** Podpowiedź: `color` = brakujący kolor (do ikonki), brak koloru = podpowiedź o różnorodności. */
export type Tip = { title: string; text: string; color?: Color; suggestions: { group: Group; name: string }[] }

/** Podpowiedzi na podstawie ostatnich `windowDays` dni: najpierw kolory z największym brakiem, potem różnorodność. */
export function checkBalance(days: Days, today: string, mode: Mode): Tip[] {
  const logged = pastKeys(shiftKey(today, -1), BALANCE.windowDays).flatMap((key) => days[key] ?? [])
  if (logged.length < BALANCE.minLoggedDays) return []

  const eaten = logged.flatMap(itemsOfDay).map(({ item, produce }) => ({ item, color: produce?.color }))
  const period = `W ostatnich ${BALANCE.windowDays} dniach`

  const colorTips: (Tip & { missing: number })[] = COLOR_ORDER.map((color) => {
    const { few, benefit, weeklyMin } = COLORS[color]
    const have = eaten.filter((e) => e.color === color).reduce((sum, e) => sum + portions([e.item], mode), 0) // z wielu dni, więc sumujemy pozycje
    return {
      missing: 1 - have / weeklyMin,
      title: `Mało ${few} warzyw i owoców`,
      text: `${period}: ${Math.round(have)} z ${weeklyMin} porcji. Dodaj je — ${benefit}.`,
      color,
      suggestions: ALL_PRODUCE.filter(({ produce }) => produce.color === color).slice(0, 5).map(({ group, produce }) => ({ group, name: produce.name })),
    }
  })
    .filter((tip) => tip.missing > 0)
    .sort((a, b) => b.missing - a.missing)

  const distinct = new Set(eaten.map((e) => e.item.name)).size
  const varietyTip: Tip[] =
    distinct < BALANCE.weeklyVariety
      ? [{ title: 'Spróbuj czegoś nowego', text: `${period}: ${distinct} z ${BALANCE.weeklyVariety} różnych warzyw i owoców. Różnorodność karmi dobre bakterie jelitowe.`, suggestions: [] }]
      : []

  return [...colorTips, ...varietyTip].slice(0, BALANCE.maxTips)
}
