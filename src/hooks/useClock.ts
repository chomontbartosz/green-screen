// Aktualny czas i dzisiejsza data. O północy (00:00) data sama zmienia się na nowy dzień.

import { useEffect, useState } from 'react'
import { toKey } from '../lib/date'
import { TEST } from '../lib/testParams'

function currentTime() {
  const now = new Date()
  if (TEST.hour !== null) now.setHours(TEST.hour)
  return now
}

export function useClock() {
  const [now, setNow] = useState(currentTime)

  useEffect(() => {
    const timer = setInterval(() => setNow(currentTime()), 30_000) // sprawdzaj co 30 s
    return () => clearInterval(timer)
  }, [])

  return { now, today: toKey(now) }
}
