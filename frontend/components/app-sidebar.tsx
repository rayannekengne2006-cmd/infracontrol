'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Activity, Menu, X, Settings, LifeBuoy } from 'lucide-react'
import { navItems } from '@/lib/navigation'
import { alerts } from '@/lib/data'
import { cn } from '@/lib/utils'

const openAlertCount = alerts.filter((a) => !a.acknowledged).length

export function AppSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-40 inline-flex size-9 items-center justify-center rounded-md border bg-card text-foreground md:hidden"
        aria-label="Ouvrir le menu de navigation"
      >
        <Menu className="size-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:sticky md:top-0 md:h-dvh md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation principale"
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Activity className="size-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight text-sidebar-accent-foreground">
                NetOps Console
              </span>
              <span className="mt-1 font-mono text-[10px] text-muted-foreground">v4.2.1 · prod</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="Fermer le menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Modules
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                      active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                    )}
                  >
                    {active && (
                      <span
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary"
                        aria-hidden="true"
                      />
                    )}
                    <Icon
                      className={cn('size-4 shrink-0', active ? 'text-sidebar-primary' : 'text-muted-foreground')}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                    {item.href === '/alertes' && openAlertCount > 0 && (
                      <span className="ml-auto rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-destructive">
                        {openAlertCount}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <p className="mt-6 px-2 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Système
          </p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <span className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/60">
                <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
                Paramètres
              </span>
            </li>
            <li>
              <span className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/60">
                <LifeBuoy className="size-4 text-muted-foreground" aria-hidden="true" />
                Support
              </span>
            </li>
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent font-mono text-xs font-medium text-sidebar-accent-foreground">
              AM
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-accent-foreground">Alexandre Martin</p>
              <p className="truncate text-xs text-muted-foreground">Ingénieur réseau · Admin</p>
            </div>
            <span className="size-2 rounded-full bg-success" aria-label="Connecté" />
          </div>
        </div>
      </aside>
    </>
  )
}
