// Strona „Odznaki”: seria dni z rzędu i wszystkie odznaki z licznikami.

import { Badges } from '../components/Badges'

export function BadgesPage({ today }: { today: string }) {
  return (
    <div className="space-y-4">
      <Badges today={today} />
    </div>
  )
}
