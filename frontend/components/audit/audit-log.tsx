'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { auditEntries, type AuditAction } from '@/lib/data'
import { cn } from '@/lib/utils'

const actionLabels: Record<AuditAction, string> = {
  config: 'Configuration',
  connexion: 'Connexion',
  creation: 'Création',
  suppression: 'Suppression',
  systeme: 'Système',
}

const actionTone: Record<AuditAction, string> = {
  config: 'text-primary bg-primary/10',
  connexion: 'text-foreground bg-muted',
  creation: 'text-success bg-success/10',
  suppression: 'text-destructive bg-destructive/10',
  systeme: 'text-muted-foreground bg-muted',
}

export function AuditLog() {
  const [query, setQuery] = useState('')
  const [action, setAction] = useState<'toutes' | AuditAction>('toutes')
  const [onlyFailures, setOnlyFailures] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return auditEntries.filter(
      (e) =>
        (action === 'toutes' || e.action === action) &&
        (!onlyFailures || e.result === 'echec') &&
        (!q || [e.user, e.target, e.detail, e.ip].some((v) => v.toLowerCase().includes(q))),
    )
  }, [query, action, onlyFailures])

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-col gap-3 border-b p-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher dans le journal</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Utilisateur, cible, IP source, détail…"
            className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label>
          <span className="sr-only">Type d&apos;action</span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as typeof action)}
            className="h-9 rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="toutes">Toutes les actions</option>
            {Object.entries(actionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={onlyFailures}
            onChange={(e) => setOnlyFailures(e.target.checked)}
            className="size-3.5 accent-[var(--primary)]"
          />
          Échecs uniquement
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Horodatage (UTC+1)</th>
              <th className="px-4 py-2.5 font-medium">Utilisateur</th>
              <th className="px-4 py-2.5 font-medium">Action</th>
              <th className="px-4 py-2.5 font-medium">Cible</th>
              <th className="px-4 py-2.5 font-medium">Détail</th>
              <th className="px-4 py-2.5 font-medium">IP source</th>
              <th className="px-4 py-2.5 font-medium">Résultat</th>
            </tr>
          </thead>
          <tbody className="divide-y font-mono text-xs">
            {filtered.map((e) => (
              <tr key={e.id} className="transition-colors hover:bg-accent/40">
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{e.timestamp}</td>
                <td className={cn('px-4 py-3', e.user === 'inconnu' && 'text-destructive')}>{e.user}</td>
                <td className="px-4 py-3">
                  <span className={cn('rounded px-1.5 py-0.5 font-sans text-[11px]', actionTone[e.action])}>
                    {actionLabels[e.action]}
                  </span>
                </td>
                <td className="px-4 py-3 text-primary">{e.target}</td>
                <td className="px-4 py-3 font-sans text-sm text-foreground/85">{e.detail}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.ip}</td>
                <td className="px-4 py-3">
                  {e.result === 'succes' ? (
                    <span className="text-success">SUCCÈS</span>
                  ) : (
                    <span className="text-destructive">ÉCHEC</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center font-sans text-sm text-muted-foreground">
                  Aucune entrée ne correspond à la recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">
        {filtered.length} entrée(s) affichée(s) sur {auditEntries.length}
      </div>
    </div>
  )
}
