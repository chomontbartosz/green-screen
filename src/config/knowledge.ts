// BAZA WIEDZY — teksty ekranów: „Co się liczy, a co nie”, „Jak przechowywać i przygotowywać”, „Mity i fakty”,
// „Nasze podejście vs dieta”. Ekrany „Kolory” i „Witaminy i minerały” budują się same z config/balance.ts
// i config/nutrients.ts, a „Warzywa i owoce” z config/produce.ts. Listę ekranów ustawia pages/KnowledgePage.tsx.

export const COUNTS = {
  intro: 'Porcja to garść (ok. 80 g) warzyw lub owoców. Liczy się to, co faktycznie ląduje na talerzu w ilości porcji — nie dodatek „dla smaku”.',
  yes: [
    'Świeże, mrożone i kiszone warzywa i owoce',
    'Z puszki — w wodzie lub soku, nie w syropie',
    'Domowa zupa warzywna (garść warzyw w misce)',
    'Suszone owoce — ok. 30 g, czyli mała garść',
    'Sok 100% lub smoothie — maks. 1 porcja dziennie, nawet jeśli wypijesz więcej',
    'Strączki: fasola, ciecierzyca, soczewica — maks. 1 porcja dziennie (aplikacja liczy to sama)',
  ],
  no: [
    'Ketchup i sosy pomidorowe — za mało warzyw, za dużo cukru i soli',
    'Frytki, chipsy, placki ziemniaczane',
    'Ciasto marchewkowe, szarlotka, drożdżówka z owocami — głównie cukier i mąka',
    'Dżem, konfitury, owoce w syropie',
    'Jogurt owocowy, batonik „z owocami”, płatki z kawałkami owoców',
    'Napoje „o smaku owocowym” i nektary',
  ],
  callout: {
    title: '🍋 Plasterek cytryny w herbacie się nie liczy',
    text: 'Tak samo listek sałaty w kanapce czy natka do dekoracji. Żeby zaliczyć porcję cytryny, trzeba zjeść tyle, ile zmieści się w garści.',
  },
  potatoNote: 'Ziemniaki: w aplikacji się liczą, ale wiele zaleceń (np. brytyjskie NHS) traktuje je jak kaszę czy makaron, czyli dodatek skrobiowy. Bataty liczą się zawsze.',
}

export const STORAGE = [
  { icon: '🧊', title: 'Lodówka', text: 'Sałaty, szpinak, brokuły, papryka i owoce jagodowe — w szufladzie na warzywa. Myj tuż przed jedzeniem, nie przed schowaniem.' },
  { icon: '🏠', title: 'Poza lodówką', text: 'Pomidory, banany, awokado (do dojrzenia), ziemniaki i cebula — w chłodnym, ciemnym miejscu. Ziemniaki i cebulę trzymaj osobno.' },
  { icon: '🍎', title: 'Uwaga na jabłka i banany', text: 'Wydzielają etylen, który przyspiesza dojrzewanie innych owoców. Trzymaj je osobno — albo połóż obok twardego awokado, żeby szybciej dojrzało.' },
  { icon: '❄️', title: 'Mrożonki są OK', text: 'Mrożone tuż po zbiorze zachowują witaminy. Warzyw nie rozmrażaj przed gotowaniem — wrzucaj prosto do garnka.' },
  { icon: '♨️', title: 'Gotuj krótko', text: 'Witamina C i witaminy z grupy B uciekają do wody i nie lubią długiego gotowania. Najlepiej na parze albo w małej ilości wody; zupę jedz z wywarem.' },
  { icon: '🫒', title: 'Dodaj odrobinę tłuszczu', text: 'Beta-karoten (marchew, dynia), likopen (pomidory) i witaminy A, D, E, K wchłaniają się lepiej z łyżką oliwy lub oleju.' },
  { icon: '🥕', title: 'Surowe i gotowane — oba dobre', text: 'Surowe zachowują więcej witaminy C, a z gotowanych pomidorów i marchwi wchłaniasz więcej karotenoidów. Mieszaj jedne i drugie.' },
  { icon: '🥒', title: 'Kiszonki', text: 'Wybieraj kiszone, nie kwaszone octem — tylko kiszone mają żywe bakterie. Pasteryzacja je zabija. Trzymaj w lodówce.' },
  { icon: '🍆', title: 'Nie obieraj bez potrzeby', text: 'W skórce jabłek, ogórków i bakłażana jest dużo błonnika i barwników. Dokładnie umyj i jedz ze skórką.' },
]

export const MYTHS = [
  { myth: 'Owoce tuczą, bo mają cukier', fact: 'Cukier w całych owocach idzie w parze z błonnikiem i wodą, które sycą. W badaniach jedzenie owoców wiąże się raczej z niższą masą ciała.' },
  { myth: 'Mrożonki są gorsze od świeżych', fact: 'Mrożone tuż po zbiorze często mają tyle samo witamin, a zimą nawet więcej niż „świeże” po tygodniach transportu.' },
  { myth: 'Sok to to samo, co owoc', fact: 'Sok nie ma błonnika i łatwo wypić w nim dużo cukru. Dlatego liczy się maks. 1 porcja dziennie.' },
  { myth: 'Gotowane warzywa nie mają wartości', fact: 'Tracą część witaminy C, ale np. z gotowanych pomidorów i marchwi organizm wchłania więcej karotenoidów.' },
  { myth: 'Owoców nie je się wieczorem', fact: 'Pora dnia nie ma znaczenia. Liczy się, ile i jak różnorodnie jesz w ciągu całego dnia.' },
  { myth: 'Zdrowe są tylko warzywa „eko”', fact: 'Zwykłe warzywa i owoce dają tę samą korzyść. Ważniejsze, żeby jeść ich dużo i różnorodnie — i myć przed jedzeniem.' },
  { myth: 'Ziemniak to warzywo jak każde inne', fact: 'W wielu zaleceniach to dodatek skrobiowy, jak kasza czy makaron. Warto jeść go obok innych warzyw, a nie zamiast nich.' },
  { myth: 'Detoks sokowy oczyszcza organizm', fact: 'Oczyszczaniem zajmują się wątroba i nerki. Codzienne 5 + 5 robi dla zdrowia więcej niż kilkudniowa kuracja.' },
]

export const APPROACH = {
  intro: 'Green Screen to nie dieta, tylko nawyk. Nie musisz z niczego rezygnować — wystarczy dokładać kolorowe rośliny.',
  rows: [
    { topic: 'Cel', diet: 'Schudnąć X kg do konkretnej daty', ours: 'Zdrowszy nawyk na lata' },
    { topic: 'Co liczysz', diet: 'Kalorie, makroskładniki, gramy', ours: 'Garście (gramy tylko, jeśli chcesz)' },
    { topic: 'Zasady', diet: 'Listy zakazanych produktów', ours: 'Nic nie jest zakazane, dokładasz rośliny' },
    { topic: 'Czas dziennie', diet: 'Ważenie i wpisywanie każdego posiłku', ours: 'Ok. 10 sekund' },
    { topic: 'Gorszy dzień', diet: 'Poczucie porażki, często koniec diety', ours: 'Nowy dzień, nowy wynik' },
    { topic: 'Motywacja', diet: 'Liczba na wadze', ours: 'Wynik, kolory, odznaki, samopoczucie' },
    { topic: 'Po zakończeniu', diet: 'Ryzyko efektu jo-jo', ours: 'Nie ma końca — nawyk zostaje' },
  ],
  note: 'Jeśli potrzebujesz diety ze wskazań medycznych lub ścisłej redukcji masy ciała, skorzystaj z pomocy lekarza lub dietetyka. Green Screen możesz używać równolegle.',
}
