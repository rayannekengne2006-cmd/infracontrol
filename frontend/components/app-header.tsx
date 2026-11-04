'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronRight, Search } from 'lucide-react'
import { findNavItem } from '@/lib/navigation'

export function AppHeader() {
  const pathname = usePathname()
  const current = findNavItem(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 pl-14 pr-4 backdrop-blur md:px-8">
      <nav aria-label="Fil d'Ariane" className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="hidden text-muted-foreground sm:inline">Organisation</span>
        <ChevronRight className="hidden size-3.5 text-muted-foreground sm:inline" aria-hidden="true" />
        <span className="truncate font-medium">{current?.label ?? 'Console'}</span>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <label className="relative hidden lg:block">
          <span className="sr-only">Rechercher</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Rechercher un hôte, une IP, un VLAN…"
            className="h-9 w-72 rounded-md border bg-card pl-8 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </label>

        <div className="hidden items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 sm:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">Collecte active</span>
        </div>

        <Link
          href="/alertes"
          className="relative inline-flex size-9 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voir les alertes"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
