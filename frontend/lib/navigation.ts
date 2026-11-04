import {
  LayoutDashboard,
  Server,
  Stethoscope,
  Network,
  BellRing,
  ScrollText,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    description: "Vue d'ensemble de l'état du réseau en temps réel",
  },
  {
    href: '/inventaire',
    label: 'Inventaire des équipements',
    icon: Server,
    description: 'Routeurs, commutateurs, pare-feu et points d’accès gérés',
  },
  {
    href: '/diagnostic',
    label: 'Outils de diagnostic',
    icon: Stethoscope,
    description: 'Ping, traceroute, résolution DNS et scan de ports',
  },
  {
    href: '/reseaux',
    label: 'Gestion des réseaux',
    icon: Network,
    description: 'VLAN, sous-réseaux et plans d’adressage IP',
  },
  {
    href: '/alertes',
    label: 'Alertes',
    icon: BellRing,
    description: 'Incidents actifs et notifications de supervision',
  },
  {
    href: '/audit',
    label: "Journal d'Audit",
    icon: ScrollText,
    description: 'Historique des actions et modifications de configuration',
  },
]

export function findNavItem(pathname: string) {
  return navItems.find((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  )
}
