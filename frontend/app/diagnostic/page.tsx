import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { DiagnosticConsole } from '@/components/diagnostic/diagnostic-console'

export const metadata: Metadata = { title: 'Outils de diagnostic — NetOps Console' }

export default function DiagnosticPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Outils de diagnostic"
        description="Exécutez des tests de connectivité depuis les sondes de la plateforme."
      />
      <DiagnosticConsole />
    </div>
  )
}
