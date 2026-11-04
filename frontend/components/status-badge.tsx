import { cn } from '@/lib/utils'
import type { DeviceStatus, Severity } from '@/lib/data'

const deviceStatusMap: Record<DeviceStatus, { label: string; className: string; dot: string }> = {
  'en-ligne': { label: 'En ligne', className: 'text-success bg-success/10 ring-success/20', dot: 'bg-success' },
  degrade: { label: 'Dégradé', className: 'text-warning bg-warning/10 ring-warning/20', dot: 'bg-warning' },
  'hors-ligne': { label: 'Hors ligne', className: 'text-destructive bg-destructive/10 ring-destructive/25', dot: 'bg-destructive' },
  maintenance: { label: 'Maintenance', className: 'text-primary bg-primary/10 ring-primary/20', dot: 'bg-primary' },
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  const s = deviceStatusMap[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        s.className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', s.dot)} aria-hidden="true" />
      {s.label}
    </span>
  )
}

const severityMap: Record<Severity, { label: string; className: string }> = {
  critique: { label: 'Critique', className: 'text-destructive bg-destructive/10 ring-destructive/25' },
  majeure: { label: 'Majeure', className: 'text-warning bg-warning/10 ring-warning/20' },
  mineure: { label: 'Mineure', className: 'text-primary bg-primary/10 ring-primary/20' },
  info: { label: 'Info', className: 'text-muted-foreground bg-muted ring-border' },
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = severityMap[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ring-1 ring-inset',
        s.className,
      )}
    >
      {s.label}
    </span>
  )
}

export function UsageBar({ value, className }: { value: number; className?: string }) {
  const tone = value >= 85 ? 'bg-destructive' : value >= 70 ? 'bg-warning' : 'bg-primary'
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn('h-full rounded-full', tone)} style={{ width: `${value}%` }} />
    </div>
  )
}
