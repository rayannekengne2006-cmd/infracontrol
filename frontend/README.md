# NetOps Console

Interface frontend d'administration réseau construite avec **Next.js**, **React**, **TypeScript**, **Tailwind CSS** et **Recharts**.

## Fonctionnement du frontend

L'application propose une console sombre de supervision réseau avec une navigation latérale persistante :

- **Tableau de bord** : indicateurs de disponibilité, alertes ouvertes, CPU moyen, latence WAN, trafic réseau et état des sites.
- **Inventaire des équipements** : tableau filtrable par recherche, type et état avec métriques CPU/mémoire.
- **Outils de diagnostic** : console interactive simulant Ping, Traceroute, résolution DNS et scan de ports depuis différentes sondes.
- **Gestion des réseaux** : VLAN, sous-réseaux, passerelles, DHCP et utilisation des adresses IP.
- **Alertes** : filtres par criticité, acquittement individuel ou global et suivi des incidents.
- **Journal d'Audit** : recherche et filtrage des actions de configuration, connexions, créations, suppressions et événements système.

La navigation utilise l'App Router de Next.js. Les pages sont organisées dans `app/`, tandis que les composants réutilisables se trouvent dans `components/`. Les données actuellement affichées sont des données de démonstration centralisées dans `lib/data.ts` ; elles pourront être remplacées par des appels API ou une base de données.

## Prérequis

- Node.js 20 ou supérieur
- pnpm 12 ou npm

## Installation

Depuis la racine du projet :

```bash
pnpm install
```

Avec npm :

```bash
npm install
```

## Démarrer en développement

```bash
pnpm dev
```

Ou avec npm :

```bash
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Scripts disponibles

| Commande | Description |
| --- | --- |
| `pnpm dev` | Lance le serveur Next.js en mode développement |
| `pnpm build` | Génère le build de production |
| `pnpm start` | Démarre l'application compilée en production |

## Structure principale

```text
app/
├── page.tsx                 # Tableau de bord
├── inventaire/page.tsx      # Inventaire des équipements
├── diagnostic/page.tsx      # Outils de diagnostic
├── reseaux/page.tsx         # Gestion des réseaux
├── alertes/page.tsx         # Alertes
└── audit/page.tsx           # Journal d'audit
components/
├── app-header.tsx           # En-tête global
├── app-sidebar.tsx          # Navigation latérale responsive
├── dashboard/               # Cartes et graphique du tableau de bord
├── inventory/               # Tableau des équipements
├── diagnostic/              # Console de diagnostic
├── alerts/                  # Liste et actions sur les alertes
└── audit/                   # Tableau du journal d'audit
lib/
├── data.ts                  # Données de démonstration et types
├── navigation.ts            # Configuration des modules
└── utils.ts                 # Utilitaires partagés
```

## Ajouter une nouvelle fonctionnalité

1. Ajoutez ou modifiez les données et types dans `lib/data.ts` si nécessaire.
2. Créez la page dans `app/<module>/page.tsx`.
3. Ajoutez les composants spécifiques dans `components/<module>/`.
4. Ajoutez le module dans `lib/navigation.ts` pour le rendre visible dans la Sidebar.
5. Utilisez les composants UI existants dans `components/ui/` et les tokens définis dans `app/globals.css`.

## Notes

- Le thème est configuré en mode sombre avec des couleurs accessibles et des indicateurs d'état sémantiques.
- Les interactions de filtrage, d'acquittement et de diagnostic sont gérées côté client avec React.
- Aucune donnée métier n'est persistée pour le moment : les actions sont réinitialisées au rechargement de la page.