import Link from 'next/link'
import { ArrowUpRight, Cpu, Gauge, Server, ShieldAlert } from 'lucide-react'
import { PageHeader, Panel } from '@/components/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { TrafficChart } from '@/components/dashboard/traffic-chart'
import { DeviceStatusBadge, SeverityBadge, UsageBar } from '@/components/status-badge'
import { alerts, devices, sites } from '@/lib/data'

export default function DashboardPage() {
  const online = devices.filter((d) => d.status === 'en-ligne').length
  const openAlerts = alerts.filter((a) => !a.acknowledged)
  const critical = openAlerts.filter((a) => a.severity === 'critique').length
  const avgCpu = Math.round(
    devices.filter((d) => d.status !== 'hors-ligne').reduce((s, d) => s + d.cpu, 0) /
      devices.filter((d) => d.status !== 'hors-ligne').length,
  )
  const topLoad = [...devices].sort((a, b) => b.cpu - a.cpu).slice(0, 5)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'infrastructure — dernière collecte il y a 12 secondes."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Équipements en ligne"
          value={`${online}/${devices.length}`}
          hint={`${Math.round((online / devices.length) * 100)}% de disponibilité`}
          icon={Server}
          tone="success"
        />
        <StatCard
          label="Alertes ouvertes"
          value={String(openAlerts.length)}
          hint={`${critical} critique${critical > 1 ? 's' : ''}`}
          icon={ShieldAlert}
          tone="destructive"
        />
        <StatCard label="CPU moyen" value={`${avgCpu}%`} hint="Sur les équipements actifs" icon={Cpu} tone="primary" />
        <StatCard label="Latence WAN" value="8,4 ms" hint="p95 inter-sites" icon={Gauge} tone="warning" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          title="Trafic agrégé"
          description="Débit entrant / sortant sur les liens de cœur (Gbit/s), 24 dernières heures"
          className="xl:col-span-2"
        >
          <div className="p-4">
            <TrafficChart />
          </div>
        </Panel>

        <Panel
          title="Alertes récentes"
          action={
            <Link href="/alertes" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              Tout voir <ArrowUpRight className="size-3" aria-hidden="true" />
            </Link>
          }
        >
          <ul className="divide-y">
            {openAlerts.slice(0, 5).map((alert) => (
              <li key={alert.id} className="flex flex-col gap-1.5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <SeverityBadge severity={alert.severity} />
                  <span className="font-mono text-[11px] text-muted-foreground">{alert.time}</span>
                </div>
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="font-mono text-xs text-muted-foreground">{alert.source}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Santé des sites" description="Disponibilité sur 30 jours glissants">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Site</th>
                  <th className="px-4 py-2.5 font-medium">Équip.</th>
                  <th className="px-4 py-2.5 font-medium">Latence</th>
                  <th className="px-4 py-2.5 font-medium">Dispo.</th>
                  <th className="px-4 py-2.5 font-medium">État</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sites.map((site) => (
                  <tr key={site.name}>
                    <td className="px-4 py-3 font-medium">{site.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{site.devices}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{site.latency} ms</td>
                    <td className="px-4 py-3 font-mono">{site.availability}%</td>
                    <td className="px-4 py-3">
                      <DeviceStatusBadge status={site.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Charge CPU la plus élevée" description="Top 5 des équipements">
          <ul className="divide-y">
            {topLoad.map((d) => (
              <li key={d.id} className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm">{d.hostname}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.type} · {d.site}
                  </p>
                </div>
                <div className="w-32">
                  <UsageBar value={d.cpu} />
                </div>
                <span className="w-10 text-right font-mono text-sm tabular-nums">{d.cpu}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
