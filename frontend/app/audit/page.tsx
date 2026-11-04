import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { AuditLog } from '@/components/audit/audit-log'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: "Journal d'Audit — NetOps Console" }

export default function AuditPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Journal d'Audit"
        description="Traçabilité complète des connexions et modifications de configuration (rétention 365 jours)."
        actions={
          <Button variant="outline" size="sm">
            <Download aria-hidden="true" /> Exporter
          </Button>
        }
      />
      <AuditLog />
    </div>
  )
}
