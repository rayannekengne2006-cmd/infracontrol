export type DeviceStatus = 'en-ligne' | 'degrade' | 'hors-ligne' | 'maintenance'
export type DeviceType = 'Routeur' | 'Commutateur' | 'Pare-feu' | "Point d'accès" | 'Serveur'

export type Device = {
  id: string
  hostname: string
  type: DeviceType
  vendor: string
  model: string
  ip: string
  site: string
  firmware: string
  status: DeviceStatus
  cpu: number
  memory: number
  uptime: string
}

export const devices: Device[] = [
  { id: 'DEV-001', hostname: 'core-rtr-par-01', type: 'Routeur', vendor: 'Cisco', model: 'ASR 1001-X', ip: '10.0.0.1', site: 'Paris DC1', firmware: 'IOS-XE 17.9.4', status: 'en-ligne', cpu: 34, memory: 52, uptime: '182j 04h' },
  { id: 'DEV-002', hostname: 'core-rtr-par-02', type: 'Routeur', vendor: 'Cisco', model: 'ASR 1001-X', ip: '10.0.0.2', site: 'Paris DC1', firmware: 'IOS-XE 17.9.4', status: 'en-ligne', cpu: 29, memory: 48, uptime: '182j 04h' },
  { id: 'DEV-003', hostname: 'dist-sw-par-a1', type: 'Commutateur', vendor: 'Arista', model: '7050SX3', ip: '10.0.1.11', site: 'Paris DC1', firmware: 'EOS 4.31.2F', status: 'degrade', cpu: 87, memory: 71, uptime: '41j 12h' },
  { id: 'DEV-004', hostname: 'dist-sw-par-a2', type: 'Commutateur', vendor: 'Arista', model: '7050SX3', ip: '10.0.1.12', site: 'Paris DC1', firmware: 'EOS 4.31.2F', status: 'en-ligne', cpu: 22, memory: 39, uptime: '41j 12h' },
  { id: 'DEV-005', hostname: 'fw-edge-par-01', type: 'Pare-feu', vendor: 'Fortinet', model: 'FortiGate 600F', ip: '10.0.2.1', site: 'Paris DC1', firmware: 'FortiOS 7.4.3', status: 'en-ligne', cpu: 46, memory: 63, uptime: '97j 08h' },
  { id: 'DEV-006', hostname: 'fw-edge-lyo-01', type: 'Pare-feu', vendor: 'Palo Alto', model: 'PA-3220', ip: '10.10.2.1', site: 'Lyon DC2', firmware: 'PAN-OS 11.1.2', status: 'maintenance', cpu: 5, memory: 18, uptime: '0j 02h' },
  { id: 'DEV-007', hostname: 'acc-sw-lyo-b3', type: 'Commutateur', vendor: 'Juniper', model: 'EX4400-48P', ip: '10.10.1.23', site: 'Lyon DC2', firmware: 'Junos 23.2R1', status: 'hors-ligne', cpu: 0, memory: 0, uptime: '—' },
  { id: 'DEV-008', hostname: 'ap-bur-lil-12', type: "Point d'accès", vendor: 'Aruba', model: 'AP-635', ip: '10.20.5.112', site: 'Lille Bureau', firmware: 'AOS 10.5.1', status: 'en-ligne', cpu: 18, memory: 34, uptime: '23j 17h' },
  { id: 'DEV-009', hostname: 'ap-bur-lil-13', type: "Point d'accès", vendor: 'Aruba', model: 'AP-635', ip: '10.20.5.113', site: 'Lille Bureau', firmware: 'AOS 10.5.1', status: 'degrade', cpu: 64, memory: 81, uptime: '23j 17h' },
  { id: 'DEV-010', hostname: 'srv-radius-01', type: 'Serveur', vendor: 'Dell', model: 'PowerEdge R650', ip: '10.0.3.20', site: 'Paris DC1', firmware: 'Ubuntu 22.04', status: 'en-ligne', cpu: 12, memory: 44, uptime: '64j 21h' },
  { id: 'DEV-011', hostname: 'core-rtr-lyo-01', type: 'Routeur', vendor: 'Juniper', model: 'MX204', ip: '10.10.0.1', site: 'Lyon DC2', firmware: 'Junos 23.4R1', status: 'en-ligne', cpu: 38, memory: 57, uptime: '120j 10h' },
  { id: 'DEV-012', hostname: 'acc-sw-mar-c1', type: 'Commutateur', vendor: 'Cisco', model: 'Catalyst 9300', ip: '10.30.1.10', site: 'Marseille Agence', firmware: 'IOS-XE 17.12.1', status: 'en-ligne', cpu: 15, memory: 29, uptime: '210j 03h' },
]

export type Severity = 'critique' | 'majeure' | 'mineure' | 'info'

export type Alert = {
  id: string
  title: string
  source: string
  severity: Severity
  time: string
  description: string
  acknowledged: boolean
}

export const alerts: Alert[] = [
  { id: 'ALR-4821', title: 'Équipement injoignable', source: 'acc-sw-lyo-b3', severity: 'critique', time: 'il y a 4 min', description: 'Aucune réponse ICMP/SNMP depuis 4 minutes. 48 ports d’accès impactés.', acknowledged: false },
  { id: 'ALR-4820', title: 'Utilisation CPU élevée (87%)', source: 'dist-sw-par-a1', severity: 'majeure', time: 'il y a 11 min', description: 'Seuil de 85% dépassé pendant plus de 5 minutes consécutives.', acknowledged: false },
  { id: 'ALR-4819', title: 'Perte de paquets sur lien WAN', source: 'core-rtr-par-01 · Gi0/0/1', severity: 'majeure', time: 'il y a 26 min', description: 'Perte moyenne de 3,2% vers le PoP Lyon sur les 15 dernières minutes.', acknowledged: true },
  { id: 'ALR-4818', title: 'Mémoire saturée (81%)', source: 'ap-bur-lil-13', severity: 'mineure', time: 'il y a 42 min', description: 'Consommation mémoire anormale, redémarrage recommandé hors heures ouvrées.', acknowledged: false },
  { id: 'ALR-4817', title: 'Certificat TLS expirant', source: 'fw-edge-par-01', severity: 'mineure', time: 'il y a 1 h', description: 'Le certificat du portail VPN SSL expire dans 12 jours.', acknowledged: false },
  { id: 'ALR-4816', title: 'Fenêtre de maintenance démarrée', source: 'fw-edge-lyo-01', severity: 'info', time: 'il y a 2 h', description: 'Mise à jour PAN-OS 11.1.2 planifiée par a.martin.', acknowledged: true },
  { id: 'ALR-4815', title: 'Flapping BGP détecté', source: 'core-rtr-lyo-01 · AS64512', severity: 'majeure', time: 'il y a 3 h', description: 'Session BGP avec le transitaire réinitialisée 6 fois en 10 minutes.', acknowledged: true },
  { id: 'ALR-4814', title: 'Sauvegarde de configuration réussie', source: 'Planificateur', severity: 'info', time: 'il y a 5 h', description: '142 configurations sauvegardées vers le dépôt Git.', acknowledged: true },
]

export type Vlan = {
  id: number
  name: string
  subnet: string
  gateway: string
  site: string
  used: number
  total: number
  dhcp: boolean
}

export const vlans: Vlan[] = [
  { id: 10, name: 'MGMT', subnet: '10.0.0.0/24', gateway: '10.0.0.254', site: 'Paris DC1', used: 64, total: 254, dhcp: false },
  { id: 20, name: 'SERVEURS-PROD', subnet: '10.0.3.0/23', gateway: '10.0.3.1', site: 'Paris DC1', used: 412, total: 510, dhcp: false },
  { id: 30, name: 'UTILISATEURS', subnet: '10.20.0.0/22', gateway: '10.20.0.1', site: 'Lille Bureau', used: 731, total: 1022, dhcp: true },
  { id: 40, name: 'VOIP', subnet: '10.20.8.0/24', gateway: '10.20.8.1', site: 'Lille Bureau', used: 189, total: 254, dhcp: true },
  { id: 50, name: 'WIFI-INVITES', subnet: '172.16.0.0/22', gateway: '172.16.0.1', site: 'Multi-sites', used: 958, total: 1022, dhcp: true },
  { id: 60, name: 'DMZ', subnet: '192.168.100.0/26', gateway: '192.168.100.1', site: 'Paris DC1', used: 18, total: 62, dhcp: false },
  { id: 70, name: 'IOT-CAPTEURS', subnet: '10.40.0.0/24', gateway: '10.40.0.1', site: 'Lyon DC2', used: 97, total: 254, dhcp: true },
  { id: 80, name: 'STOCKAGE-SAN', subnet: '10.0.10.0/24', gateway: '10.0.10.1', site: 'Paris DC1', used: 32, total: 254, dhcp: false },
]

export type AuditAction = 'config' | 'connexion' | 'creation' | 'suppression' | 'systeme'

export type AuditEntry = {
  id: string
  timestamp: string
  user: string
  action: AuditAction
  target: string
  detail: string
  ip: string
  result: 'succes' | 'echec'
}

export const auditEntries: AuditEntry[] = [
  { id: 'AUD-90412', timestamp: '2026-11-03 14:32:08', user: 'a.martin', action: 'config', target: 'fw-edge-lyo-01', detail: 'Mise à jour firmware PAN-OS 11.0.3 → 11.1.2', ip: '10.0.50.14', result: 'succes' },
  { id: 'AUD-90411', timestamp: '2026-11-03 14:18:51', user: 's.dubois', action: 'config', target: 'dist-sw-par-a1', detail: 'interface Eth12 — shutdown', ip: '10.0.50.22', result: 'succes' },
  { id: 'AUD-90410', timestamp: '2026-11-03 13:57:30', user: 'inconnu', action: 'connexion', target: 'core-rtr-par-01', detail: 'Échec d’authentification SSH (3 tentatives)', ip: '185.220.101.7', result: 'echec' },
  { id: 'AUD-90409', timestamp: '2026-11-03 13:40:02', user: 'l.bernard', action: 'creation', target: 'VLAN 80', detail: 'Création VLAN STOCKAGE-SAN 10.0.10.0/24', ip: '10.0.50.31', result: 'succes' },
  { id: 'AUD-90408', timestamp: '2026-11-03 12:11:44', user: 'a.martin', action: 'connexion', target: 'Console NetOps', detail: 'Connexion SSO réussie (MFA)', ip: '10.0.50.14', result: 'succes' },
  { id: 'AUD-90407', timestamp: '2026-11-03 11:05:19', user: 'system', action: 'systeme', target: 'Planificateur', detail: 'Sauvegarde de 142 configurations', ip: '127.0.0.1', result: 'succes' },
  { id: 'AUD-90406', timestamp: '2026-11-03 10:48:37', user: 's.dubois', action: 'suppression', target: 'ACL OLD-GUEST', detail: 'Suppression liste d’accès obsolète sur fw-edge-par-01', ip: '10.0.50.22', result: 'succes' },
  { id: 'AUD-90405', timestamp: '2026-11-03 09:22:10', user: 'l.bernard', action: 'config', target: 'core-rtr-lyo-01', detail: 'Ajout voisin BGP 203.0.113.9 AS65010', ip: '10.0.50.31', result: 'echec' },
  { id: 'AUD-90404', timestamp: '2026-11-03 08:59:55', user: 'm.petit', action: 'creation', target: 'ap-bur-lil-13', detail: 'Ajout à l’inventaire (provisionnement ZTP)', ip: '10.0.50.40', result: 'succes' },
  { id: 'AUD-90403', timestamp: '2026-11-03 08:30:00', user: 'system', action: 'systeme', target: 'Collecteur SNMP', detail: 'Redémarrage du service de collecte', ip: '127.0.0.1', result: 'succes' },
]

export const trafficData = Array.from({ length: 24 }, (_, i) => {
  const hour = `${String(i).padStart(2, '0')}:00`
  const base = 2.2 + Math.sin((i - 6) / 3.8) * 1.6
  const inbound = Math.max(0.6, Number((base + ((i * 7) % 5) * 0.18).toFixed(2)))
  const outbound = Math.max(0.4, Number((base * 0.62 + ((i * 3) % 4) * 0.12).toFixed(2)))
  return { hour, inbound, outbound }
})

export const sites = [
  { name: 'Paris DC1', devices: 6, latency: 1.2, availability: 99.99, status: 'en-ligne' as DeviceStatus },
  { name: 'Lyon DC2', devices: 3, latency: 8.4, availability: 99.71, status: 'degrade' as DeviceStatus },
  { name: 'Lille Bureau', devices: 2, latency: 12.7, availability: 99.95, status: 'en-ligne' as DeviceStatus },
  { name: 'Marseille Agence', devices: 1, latency: 14.1, availability: 100, status: 'en-ligne' as DeviceStatus },
]
