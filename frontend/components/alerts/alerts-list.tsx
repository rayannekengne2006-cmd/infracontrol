'use client'

import { useState } from 'react'
import { Check, CheckCheck } from 'lucide-react'
import { alerts as initialAlerts, type Severity } from '@/lib/data'
import { SeverityBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const filters: { value: 'toutes' | Severity; label: string }[] = [
  { value: 'toutes', label: 'Toutes' },
  { value: 'critique', label: 'Critiques' },
  { value: 'majeure', label: 'Majeures' },
  { value: 'mineure', label: 'Mineures' },
  { value: 'info', label: 'Info' },
]

const borderTone: Record<Severity, string> = {
  critique: 'before:bg-destructive',
  majeure: 'before:bg-warning',
  mineure: 'before:bg-primary',
  info: 'before:bg-muted-foreground/40',
}

export function AlertsList() {
  const [items, setItems] = useState(initialAlerts)
  const [filter, setFilter] = useState<'toutes' | Severity>('toutes')
  const [hideAck, setHideAck] = useState(false)

  const visible = items.filter(
    (a) => (filter === 'toutes' || a.severity === filter) && (!hideAck || !a.acknowledged),
  )
  const counts = (s: Severity) => items.filter((a) => a.severity === s && !a.acknowledged).length

  const acknowledge = (id: string) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(['critique', 'majeure', 'mineure', 'info'] as Severity[]).map((s) => (
          <div key={s} className="rounded-lg border bg-card p-3">
            <SeverityBadge severity={s} />
            <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{counts(s)}</p>
            <p className="text-xs text-muted-foreground">non acquittée(s)</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filtrer par sévérité">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  'h-8 rounded-md px-2.5 text-xs transition-colors',
                  filter === f.value
                    ? 'bg-primary/15 text-primary ring-1 ring-inset ring-primary/30'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={hideAck}
                onChange={(e) => setHideAck(e.target.checked)}
                className="size-3.5 accent-[var(--primary)]"
              />
              Masquer les acquittées
            </label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setItems((prev) => prev.map((a) => ({ ...a, acknowledged: true })))}
            >
              <CheckCheck aria-hidden="true" /> Tout acquitter
            </Button>
          </div>
        </div>

        <ul className="divide-y">
          {visible.map((a) => (
            <li
              key={a.id}
              className={cn(
                'relative flex flex-col gap-3 px-4 py-4 before:absolute before:inset-y-3 before:left-0 before:w-0.5 before:rounded-full sm:flex-row sm:items-start',
                borderTone[a.severity],
                a.acknowledged && 'opacity-60',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={a.severity} />
                  <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">· {a.time}</span>
                </div>
                <p className="mt-1.5 text-sm font-medium">{a.title}</p>
                <p className="mt-0.5 text-pretty text-sm text-muted-foreground">{a.description}</p>
                <p className="mt-1.5 font-mono text-xs text-primary">{a.source}</p>
              </div>
              <div className="shrink-0">
                {a.acknowledged ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="size-3.5" aria-hidden="true" /> Acquittée
                  </span>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => acknowledge(a.id)}>
                    Acquitter
                  </Button>
                )}
              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground">Aucune alerte à afficher.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
