import type { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { PageHeader, Panel } from '@/components/page-header'
import { UsageBar } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { vlans } from '@/lib/data'

export const metadata: Metadata = { title: 'Gestion des réseaux — NetOps Console' }

export default function NetworksPage() {
  const totalUsed = vlans.reduce((s, v) => s + v.used, 0)
  const totalCap = vlans.reduce((s, v) => s + v.total, 0)
  const saturated = vlans.filter((v) => v.used / v.total >= 0.85)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Gestion des réseaux"
        description="VLAN, sous-réseaux et utilisation du plan d'adressage IP (IPAM)."
        actions={
          <Button size="sm">
            <Plus aria-hidden="true" /> Nouveau VLAN
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">VLAN configurés</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">{vlans.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Adresses IP attribuées</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
            {totalUsed.toLocaleString('fr-FR')}
            <span className="text-base text-muted-foreground"> / {totalCap.toLocaleString('fr-FR')}</span>
          </p>
          <UsageBar value={Math.round((totalUsed / totalCap) * 100)} className="mt-3" />
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Sous-réseaux saturés (≥ 85%)</p>
          <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-warning">{saturated.length}</p>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {saturated.map((v) => v.name).join(', ') || 'Aucun'}
          </p>
        </div>
      </div>

      <Panel title="Plan d'adressage" description="Segments de couche 2 et passerelles associées" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">VLAN</th>
                <th className="px-4 py-2.5 font-medium">Nom</th>
                <th className="px-4 py-2.5 font-medium">Sous-réseau</th>
                <th className="px-4 py-2.5 font-medium">Passerelle</th>
                <th className="px-4 py-2.5 font-medium">Site</th>
                <th className="px-4 py-2.5 font-medium">DHCP</th>
                <th className="px-4 py-2.5 font-medium">Utilisation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vlans.map((v) => {
                const pct = Math.round((v.used / v.total) * 100)
                return (
                  <tr key={v.id} className="transition-colors hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{v.id}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium">{v.name}</td>
                    <td className="px-4 py-3 font-mono text-primary">{v.subnet}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{v.gateway}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.site}</td>
                    <td className="px-4 py-3">
                      <span className={v.dhcp ? 'text-success' : 'text-muted-foreground'}>
                        {v.dhcp ? 'Actif' : 'Statique'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex w-48 items-center gap-3">
                        <UsageBar value={pct} />
                        <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-muted-foreground">
                          {v.used}/{v.total} · {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
