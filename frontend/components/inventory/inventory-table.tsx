'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { devices, type DeviceStatus, type DeviceType } from '@/lib/data'
import { DeviceStatusBadge, UsageBar } from '@/components/status-badge'
import { cn } from '@/lib/utils'

const types: ('Tous' | DeviceType)[] = ['Tous', 'Routeur', 'Commutateur', 'Pare-feu', "Point d'accès", 'Serveur']
const statuses: { value: 'tous' | DeviceStatus; label: string }[] = [
  { value: 'tous', label: 'Tous les états' },
  { value: 'en-ligne', label: 'En ligne' },
  { value: 'degrade', label: 'Dégradé' },
  { value: 'hors-ligne', label: 'Hors ligne' },
  { value: 'maintenance', label: 'Maintenance' },
]

export function InventoryTable() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof types)[number]>('Tous')
  const [status, setStatus] = useState<'tous' | DeviceStatus>('tous')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return devices.filter(
      (d) =>
        (type === 'Tous' || d.type === type) &&
        (status === 'tous' || d.status === status) &&
        (!q || [d.hostname, d.ip, d.vendor, d.model, d.site].some((v) => v.toLowerCase().includes(q))),
    )
  }, [query, type, status])

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-col gap-3 border-b p-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Filtrer les équipements</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom d'hôte, IP, constructeur, site…"
            className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filtrer par type">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                'h-8 rounded-md px-2.5 text-xs transition-colors',
                type === t
                  ? 'bg-primary/15 text-primary ring-1 ring-inset ring-primary/30'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <label>
          <span className="sr-only">Filtrer par état</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="h-9 rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Nom d&apos;hôte</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Modèle</th>
              <th className="px-4 py-2.5 font-medium">Adresse IP</th>
              <th className="px-4 py-2.5 font-medium">Site</th>
              <th className="px-4 py-2.5 font-medium">Firmware</th>
              <th className="px-4 py-2.5 font-medium">CPU</th>
              <th className="px-4 py-2.5 font-medium">Mém.</th>
              <th className="px-4 py-2.5 font-medium">Uptime</th>
              <th className="px-4 py-2.5 font-medium">État</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-accent/40">
                <td className="px-4 py-3">
                  <p className="font-mono text-sm">{d.hostname}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{d.id}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.type}</td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground">{d.vendor}</span> {d.model}
                </td>
                <td className="px-4 py-3 font-mono">{d.ip}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.site}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.firmware}</td>
                <td className="px-4 py-3">
                  <div className="flex w-20 items-center gap-2">
                    <UsageBar value={d.cpu} />
                    <span className="w-8 text-right font-mono text-xs tabular-nums">{d.cpu}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex w-20 items-center gap-2">
                    <UsageBar value={d.memory} />
                    <span className="w-8 text-right font-mono text-xs tabular-nums">{d.memory}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.uptime}</td>
                <td className="px-4 py-3">
                  <DeviceStatusBadge status={d.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Aucun équipement ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          {filtered.length} sur {devices.length} équipements
        </span>
        <span className="font-mono">Dernière découverte : 14:30:12</span>
      </div>
    </div>
  )
}
