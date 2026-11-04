import type { Metadata } from 'next'
import { Download, Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { InventoryTable } from '@/components/inventory/inventory-table'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Inventaire des équipements — NetOps Console' }

export default function InventoryPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Inventaire des équipements"
        description="Tous les équipements gérés, découverts via SNMP, LLDP et provisionnement ZTP."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download aria-hidden="true" /> Exporter CSV
            </Button>
            <Button size="sm">
              <Plus aria-hidden="true" /> Ajouter
            </Button>
          </>
        }
      />
      <InventoryTable />
    </div>
  )
}
