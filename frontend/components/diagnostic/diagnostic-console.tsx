'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, Play, Radar, Route, Square, Trash2, Wifi, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ToolId = 'ping' | 'traceroute' | 'dns' | 'portscan'

const tools: { id: ToolId; label: string; icon: LucideIcon; description: string; placeholder: string }[] = [
  { id: 'ping', label: 'Ping', icon: Wifi, description: 'Test ICMP echo', placeholder: '10.0.0.1' },
  { id: 'traceroute', label: 'Traceroute', icon: Route, description: 'Chemin réseau saut par saut', placeholder: '8.8.8.8' },
  { id: 'dns', label: 'Résolution DNS', icon: Globe, description: 'Requête A / AAAA / MX', placeholder: 'intranet.exemple.fr' },
  { id: 'portscan', label: 'Scan de ports', icon: Radar, description: 'Ports TCP courants', placeholder: '10.0.2.1' },
]

const probes = ['sonde-par-01 (Paris DC1)', 'sonde-lyo-01 (Lyon DC2)', 'sonde-lil-01 (Lille Bureau)']

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function buildOutput(tool: ToolId, target: string): string[] {
  switch (tool) {
    case 'ping': {
      const times = Array.from({ length: 5 }, () => rand(0.8, 14))
      return [
        `PING ${target} 56(84) octets de données.`,
        ...times.map((t, i) => `64 octets de ${target} : icmp_seq=${i + 1} ttl=63 temps=${t.toFixed(2)} ms`),
        '',
        `--- statistiques ping ${target} ---`,
        '5 paquets transmis, 5 reçus, 0% de perte, durée 4005 ms',
        `rtt min/moy/max = ${Math.min(...times).toFixed(2)}/${(times.reduce((a, b) => a + b) / 5).toFixed(2)}/${Math.max(...times).toFixed(2)} ms`,
      ]
    }
    case 'traceroute': {
      const hops = ['10.0.0.254', '10.0.0.1', '62.34.2.17', '193.252.98.145', '72.14.216.110', '108.170.244.193', target]
      return [
        `traceroute vers ${target}, 30 sauts max, paquets de 60 octets`,
        ...hops.map((h, i) => {
          const base = (i + 1) * 1.8
          return ` ${String(i + 1).padStart(2)}  ${h.padEnd(18)} ${rand(base, base + 2).toFixed(3)} ms  ${rand(base, base + 2).toFixed(3)} ms  ${rand(base, base + 2).toFixed(3)} ms`
        }),
      ]
    }
    case 'dns':
      return [
        `; <<>> NetOps dig <<>> ${target} ANY`,
        ';; Statut : NOERROR, id : 41822',
        '',
        ';; SECTION RÉPONSE :',
        `${target}.    300  IN  A      10.0.3.${Math.floor(rand(10, 200))}`,
        `${target}.    300  IN  AAAA   2001:db8:10::${Math.floor(rand(10, 99))}`,
        `${target}.    3600 IN  MX     10 mx1.exemple.fr.`,
        '',
        `;; Durée de la requête : ${Math.floor(rand(2, 30))} ms`,
        ';; SERVEUR : 10.0.3.53#53 (UDP)',
      ]
    case 'portscan': {
      const ports: [number, string, string][] = [
        [22, 'ssh', 'ouvert'],
        [23, 'telnet', 'filtré'],
        [80, 'http', 'fermé'],
        [161, 'snmp', 'ouvert'],
        [443, 'https', 'ouvert'],
        [3389, 'rdp', 'filtré'],
        [8443, 'https-alt', 'ouvert'],
      ]
      return [
        `Démarrage du scan sur ${target} (ports TCP courants)`,
        'PORT      ÉTAT      SERVICE',
        ...ports.map(([p, s, st]) => `${`${p}/tcp`.padEnd(10)}${st.padEnd(10)}${s}`),
        '',
        `Scan terminé : 1 hôte actif, ${ports.length} ports analysés en ${rand(1, 4).toFixed(2)} s`,
      ]
    }
  }
}

export function DiagnosticConsole() {
  const [tool, setTool] = useState<ToolId>('ping')
  const [target, setTarget] = useState('')
  const [probe, setProbe] = useState(probes[0])
  const [lines, setLines] = useState<string[]>([
    'NetOps diagnostic shell — prêt.',
    'Sélectionnez un outil, saisissez une cible puis lancez le test.',
  ])
  const [running, setRunning] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const activeTool = tools.find((t) => t.id === tool)!

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [lines])

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
  }, [])

  function stop() {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setRunning(false)
  }

  function run(e: React.FormEvent) {
    e.preventDefault()
    if (running) return
    const dest = target.trim() || activeTool.placeholder
    const output = buildOutput(tool, dest)
    setLines((prev) => [...prev, '', `admin@${probe.split(' ')[0]}:~$ ${tool} ${dest}`])
    setRunning(true)
    let i = 0
    timer.current = setInterval(() => {
      if (i >= output.length) {
        stop()
        return
      }
      const line = output[i++]
      setLines((prev) => [...prev, line])
    }, 220)
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Outil de diagnostic">
        {tools.map((t) => {
          const Icon = t.icon
          const active = t.id === tool
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={running}
              onClick={() => setTool(t.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors disabled:opacity-60',
                active ? 'border-primary/50 ring-1 ring-primary/30' : 'hover:bg-accent/50',
              )}
            >
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-md',
                  active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-xs text-muted-foreground">{t.description}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex min-w-0 flex-col rounded-lg border bg-card">
        <form onSubmit={run} className="flex flex-col gap-3 border-b p-3 md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Cible (hôte ou IP)</span>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={activeTool.placeholder}
              className="h-9 rounded-md border bg-background px-3 font-mono text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Sonde source</span>
            <select
              value={probe}
              onChange={(e) => setProbe(e.target.value)}
              className="h-9 rounded-md border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {probes.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            {running ? (
              <Button type="button" variant="destructive" onClick={stop}>
                <Square aria-hidden="true" /> Arrêter
              </Button>
            ) : (
              <Button type="submit">
                <Play aria-hidden="true" /> Lancer
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setLines([])}
              aria-label="Effacer la console"
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-2 border-b px-4 py-2">
          <span className="size-2.5 rounded-full bg-destructive/70" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-warning/70" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-success/70" aria-hidden="true" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">{probe}</span>
          {running && <span className="ml-auto font-mono text-xs text-primary">exécution…</span>}
        </div>

        <div
          ref={outputRef}
          className="h-[420px] overflow-auto bg-background/60 p-4 font-mono text-xs leading-relaxed"
          role="log"
          aria-live="polite"
        >
          {lines.map((line, i) => (
            <pre
              key={i}
              className={cn(
                'whitespace-pre-wrap',
                line.startsWith('admin@') ? 'text-primary' : 'text-foreground/85',
                /filtré|perte, durée/.test(line) && !line.includes(' 0% de perte') && 'text-warning',
              )}
            >
              {line || ' '}
            </pre>
          ))}
          {running && <span className="inline-block h-3.5 w-2 animate-pulse bg-primary" aria-hidden="true" />}
        </div>
      </div>
    </div>
  )
}
