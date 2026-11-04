import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { AlertsList } from '@/components/alerts/alerts-list'

export const metadata: Metadata = { title: 'Alertes — NetOps Console' }

export default function AlertsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Alertes"
        description="Incidents détectés par la supervision SNMP, Syslog et les sondes actives."
      />
      <AlertsList />
    </div>
  )
}
