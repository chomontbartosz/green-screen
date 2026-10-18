// DANE DEMO — losowe wpisy dla 30 dni przed wskazaną datą. Dni, które mają już wpisy, są pomijane.
// Demo celowo pomija fioletowe produkty, żeby od razu pokazać podpowiedź balansu (config/balance.ts).

import { PRODUCE } from '../config/produce'
import { portionGramsOf } from '../config/scoring'
import { pastKeys, shiftKey } from '../lib/date'
import type { Days, Group, Item, Mode } from '../types'

const DEMO_DAYS = 30

const random = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

function randomItems(group: Group, min: number, max: number, mode: Mode): Item[] {
  return Array.from({ length: random(min, max) }, () => {
    const pool = PRODUCE[group].filter((p) => p.color !== 'purple')
    const { name } = pool[random(0, pool.length - 1)]
    return mode === 'expert' ? { name, grams: Math.round((portionGramsOf(name) * random(6, 18)) / 10) } : { name }
  })
}

export function generateDemoDays(today: string, mode: Mode, existing: Days): Days {
  const days: Days = {}
  for (const key of pastKeys(shiftKey(today, -1), DEMO_DAYS)) {
    if (existing[key]) continue
    days[key] = { vegetables: randomItems('vegetables', 1, 6, mode), fruits: randomItems('fruits', 0, 5, mode) }
  }
  return days
}
