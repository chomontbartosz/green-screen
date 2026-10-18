// Baza wiedzy → „Jak przechowywać i przygotowywać” (teksty: config/knowledge.ts).

import { STORAGE } from '../../config/knowledge'
import { TipCards } from './TipCards'

export const StorageGuide = () => <TipCards tips={STORAGE} />
