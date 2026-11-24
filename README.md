# Infracontrol

Plateforme de supervision et d'administration centralisée d'un réseau informatique. Infracontrol vise à inventorier les machines, suivre leur disponibilité et leurs ressources, détecter les incidents, lancer des diagnostics et, après autorisation, effectuer certaines opérations d'administration à distance.

> **État du dépôt au 13 novembre 2026 :** le dépôt contient actuellement une interface web Next.js fonctionnelle sur le plan visuel et interactif, alimentée par des données statiques de démonstration. Il ne contient pas encore de backend Go, de service TCP, d'agent installé sur les machines, de base de données ni de véritable moteur de supervision. Les éléments décrits comme « à implémenter » dans ce document constituent l'architecture cible et non des fonctionnalités déjà opérationnelles.

## 1. État actuel du projet

### 1.1 Éléments déjà présents

Le dossier `frontend/` contient une application Next.js utilisant l'App Router, React et TypeScript.

| Module visible | Éléments déjà réalisés | Limite actuelle |
|---|---|---|
| Tableau de bord (`/`) | Cartes de synthèse, état des équipements, alertes récentes, charge CPU, graphique de trafic et état des sites | Valeurs issues de données de démonstration ; aucune collecte réelle |
| Inventaire (`/inventaire`) | Tableau des équipements, recherche et filtres | Pas de découverte réseau ni de persistance |
| Diagnostic (`/diagnostic`) | Interface de console proposant Ping, Traceroute, DNS et scan de ports TCP | Simulation côté navigateur ; aucune commande n'est exécutée sur le réseau |
| Gestion des réseaux (`/reseaux`) | Vue des VLAN, sous-réseaux, passerelles, DHCP et utilisation IP | Données statiques ; aucune configuration d'équipement |
| Alertes (`/alertes`) | Liste, filtres et acquittement des alertes dans l'état local de l'interface | Pas de moteur de détection ni de stockage durable |
| Audit (`/audit`) | Journal consultable et filtrable | Événements fictifs ; aucune traçabilité backend réelle |

Les données et types d'exemple sont centralisés dans `frontend/lib/data.ts`. Les composants d'interface sont dans `frontend/components/` et les pages dans `frontend/app/`.

### 1.2 Technologies réellement présentes

- Next.js 16 et React 19
- TypeScript
- Tailwind CSS 4
- Recharts pour les graphiques
- Lucide React pour les icônes
- pnpm comme gestionnaire de paquets indiqué dans le projet

Aucun code Go, fichier de configuration de base de données, serveur API, agent ou protocole applicatif TCP n'est présent dans l'archive examinée.

## 2. Objectifs fonctionnels

L'architecture doit permettre de faire évoluer progressivement l'interface existante vers les services suivants :

1. **Inventaire :** enregistrer les machines, leurs adresses IP, noms d'hôtes, systèmes, types et informations de rattachement au réseau.
2. **Disponibilité :** déterminer si une machine est joignable et conserver l'historique de ses états.
3. **Supervision des ressources :** collecter CPU, mémoire RAM, temps de fonctionnement et batterie lorsque le matériel expose cette information.
4. **Alertes :** générer des alertes à partir de seuils et de changements d'état, puis permettre leur acquittement.
5. **Diagnostic :** exécuter des tests réseau réels (Ping, traceroute, résolution DNS et vérification de ports TCP) depuis le serveur ou une sonde autorisée.
6. **Gestion réseau :** représenter les réseaux et sous-réseaux connus. Toute modification effective de configuration devra être ajoutée comme service distinct, avec validation et autorisation.
7. **Administration distante :** proposer uniquement des opérations explicitement autorisées, authentifiées, journalisées et limitées aux machines administrées.
8. **Audit :** conserver l'identité de l'acteur, l'action demandée, la cible, l'heure et le résultat.

Le périmètre expérimental initial peut se concentrer sur les PC disponibles pour l'équipe. La prise en charge de routeurs, commutateurs, pare-feu et autres équipements pourra être ajoutée ultérieurement selon leurs interfaces d'administration (par exemple SNMP ou API constructeur).

## 3. Architecture cible recommandée

L'architecture proposée conserve le frontend actuel et ajoute un backend Go, un service de communication TCP, des agents Go pour les machines supervisées et une base de données.

```text
                 ADMINISTRATEUR
                       |
                 Navigateur web
                       |
          HTTPS / API HTTP (JSON)
                       |
        +-----------------------------+
        | FRONTEND                    |
        | Next.js / React / TypeScript|
        | Dashboard, inventaire,      |
        | alertes, diagnostic, audit  |
        +--------------+--------------+
                       |
                       v
        +-----------------------------+
        | BACKEND CENTRAL - GO        |
        | API REST + authentification |
        | règles métier / autorisation|
        | orchestration des services  |
        +-----+-----------+-----------+
              |           |
       TCP sécurisé       | Accès données
       (TLS)              v
              |     +------------------+
              |     | Base de données  |
              |     | PostgreSQL       |
              |     +------------------+
              |
      +-------+---------------------------+
      |               |                   |
      v               v                   v
+------------+  +------------+      +-------------+
| Agent Go   |  | Agent Go   |      | Agent Go    |
| PC 1       |  | PC 2       | ...  | PC n        |
+------------+  +------------+      +-------------+
      |               |                   |
      +------ métriques / état / commandes autorisées ---+
```

### 3.1 Rôle de chaque couche

**Frontend — déjà présent**
- Affiche les informations et permet à l'administrateur d'interagir avec la plateforme.
- Appelle le backend via HTTPS et reçoit des réponses JSON.
- Ne doit pas exécuter directement des commandes système ou ouvrir des connexions TCP vers les agents depuis le navigateur.

**Backend central Go — à développer**
- Expose les routes HTTP/REST utilisées par Next.js.
- Authentifie les utilisateurs et vérifie leurs rôles et permissions.
- Reçoit et valide les données envoyées par les agents.
- Centralise les règles de supervision, les seuils d'alerte et l'orchestration des diagnostics.
- Enregistre les équipements, mesures, alertes et opérations dans la base.
- Sert de point de passage obligatoire pour toute commande d'administration.

**Service de communication TCP — à développer**
- Assure les échanges entre le backend central et les agents Go.
- Utilise TCP, conformément à la contrainte de protocole du projet.
- Il est recommandé de protéger ce canal avec TLS, d'authentifier chaque agent et de définir un format de messages versionné (JSON encadré par une longueur, ou protocole binaire documenté).
- Le canal doit gérer les délais d'attente, reconnexions, erreurs et doublons de messages.

**Agent Go — à développer**
- S'installe sur chaque PC que l'on souhaite superviser.
- Collecte les informations locales autorisées : nom d'hôte, système, CPU, mémoire, uptime et batterie si disponible.
- Transmet périodiquement les mesures et l'état au backend via TCP.
- Reçoit uniquement des tâches explicitement autorisées et renvoie leur résultat.
- Fonctionne avec un compte système aux privilèges minimaux ; il ne doit pas offrir un shell distant général ni exécuter des commandes arbitraires.

**Base de données — à intégrer**
- PostgreSQL est proposé pour stocker les utilisateurs, équipements, mesures, alertes, réseaux et journaux d'audit.
- Les mots de passe et secrets ne doivent jamais être stockés en clair.
- Prévoir des migrations versionnées et une politique de sauvegarde.

## 4. Organisation logicielle cible

La structure ci-dessous est une proposition d'évolution. Elle ne décrit pas des dossiers déjà présents, à l'exception de `frontend/`.

```text
infracontrol/
├── README.md
├── frontend/                       # Existant : application Next.js
│   ├── app/                         # Pages et routes UI
│   ├── components/                  # Composants réutilisables
│   ├── lib/
│   │   ├── data.ts                  # Données de démonstration actuelles
│   │   └── api.ts                   # À créer : client HTTP vers le backend
│   └── package.json
│
├── backend/                         # À créer : serveur Go
│   ├── cmd/
│   │   └── api/main.go              # Démarrage du serveur
│   ├── internal/
│   │   ├── api/                     # Routes HTTP, handlers, middlewares
│   │   ├── auth/                    # Authentification et autorisations
│   │   ├── devices/                 # Inventaire et cycle de vie des machines
│   │   ├── monitoring/              # Collecte, mesures et disponibilité
│   │   ├── alerts/                  # Règles et gestion des alertes
│   │   ├── diagnostics/             # Ping, traceroute, DNS, ports TCP
│   │   ├── networks/                # Réseaux, sous-réseaux et VLAN
│   │   ├── remote/                  # Opérations distantes autorisées
│   │   ├── audit/                   # Journal des actions
│   │   ├── tcp/                     # Serveur et protocole agents
│   │   └── storage/                 # Accès à la base de données
│   ├── migrations/                  # Schéma et migrations SQL
│   ├── configs/                     # Exemples de configuration
│   └── go.mod
│
├── agent/                           # À créer : agent Go installé sur les PC
│   ├── cmd/agent/main.go
│   ├── internal/
│   │   ├── collector/               # CPU, RAM, uptime, batterie
│   │   ├── client/                  # Connexion TCP/TLS au backend
│   │   ├── tasks/                   # Exécution de tâches autorisées
│   │   └── identity/                # Identité et enrôlement de l'agent
│   └── go.mod
│
└── docs/                            # À créer : architecture, API, protocole, installation
```

Il est préférable de garder le backend et l'agent dans des modules Go séparés : ils ont des responsabilités, des configurations et des cycles de déploiement différents.

## 5. Flux de fonctionnement principaux

### 5.1 Enrôlement d'une machine

1. L'administrateur crée ou autorise l'ajout d'une machine depuis l'interface.
2. Le backend génère un jeton d'enrôlement temporaire ou un mécanisme équivalent.
3. L'agent Go est installé et configuré sur le PC cible par une personne disposant des droits nécessaires.
4. L'agent établit une connexion TCP/TLS vers le serveur central et présente son identité.
5. Le backend vérifie l'identité, associe l'agent à la machine autorisée et enregistre son état.
6. L'agent commence à transmettre ses mesures selon une fréquence configurée.

L'ajout dans l'inventaire ne signifie pas que la plateforme peut automatiquement reconfigurer une carte réseau ou déplacer une machine dans un VLAN. Une telle opération nécessite des droits système et réseau spécifiques, ainsi qu'un service dédié et des contrôles supplémentaires.

### 5.2 Collecte et supervision

1. L'agent collecte localement les métriques prises en charge.
2. Il transmet un message périodique au backend via TCP/TLS.
3. Le backend valide les données et les enregistre.
4. Le moteur de supervision calcule l'état de la machine et vérifie les seuils configurés.
5. En cas d'anomalie, le service d'alertes crée un événement.
6. Le frontend récupère les données par API et actualise les vues.

Un contrôle de disponibilité réseau (par exemple ICMP ou test de port TCP) peut compléter les rapports des agents. Une machine sans agent pourra donc être testée pour sa joignabilité, mais les métriques locales détaillées comme CPU, RAM et batterie ne seront généralement pas accessibles de façon fiable sans agent ou interface de gestion équivalente.

### 5.3 Diagnostic réseau

1. L'utilisateur soumet une cible et un type de diagnostic depuis la console.
2. Le frontend envoie une requête au backend.
3. Le backend valide la cible, les permissions et les limites d'exécution.
4. Le service de diagnostic exécute le test depuis le serveur ou une sonde autorisée.
5. Le résultat est renvoyé à l'interface et inscrit dans le journal si nécessaire.

Les scans de ports doivent être limités aux équipements du périmètre autorisé. Les commandes système doivent être exécutées avec des paramètres validés, sans concaténer directement des entrées utilisateur dans une commande shell.

### 5.4 Administration distante

1. L'utilisateur authentifié demande une opération précise sur une machine.
2. Le backend vérifie son rôle, la permission sur la cible et la nature de l'opération.
3. Si elle est autorisée, le backend transmet une tâche identifiée à l'agent concerné via TCP/TLS.
4. L'agent vérifie que la tâche appartient à sa liste blanche et l'exécute avec les privilèges minimaux nécessaires.
5. Le résultat est retourné au backend puis présenté à l'utilisateur.
6. La demande et son résultat sont enregistrés dans l'audit.

## 6. API HTTP envisagée

Les routes suivantes sont une convention de départ à implémenter dans le backend Go. Elles ne sont pas encore disponibles dans le dépôt.

| Méthode | Route proposée | Rôle |
|---|---|---|
| `GET` | `/api/v1/dashboard` | Indicateurs du tableau de bord |
| `GET`, `POST` | `/api/v1/devices` | Lister et enregistrer des équipements |
| `GET`, `PATCH` | `/api/v1/devices/{id}` | Consulter ou modifier les métadonnées d'un équipement |
| `GET` | `/api/v1/devices/{id}/metrics` | Consulter l'historique des mesures |
| `GET` | `/api/v1/alerts` | Lister et filtrer les alertes |
| `POST` | `/api/v1/alerts/{id}/acknowledge` | Acquitter une alerte |
| `GET`, `POST` | `/api/v1/networks` | Consulter et enregistrer les réseaux connus |
| `POST` | `/api/v1/diagnostics` | Lancer un diagnostic autorisé |
| `GET` | `/api/v1/audit` | Consulter le journal d'audit |
| `POST` | `/api/v1/agents/enroll` | Enrôler un agent (à sécuriser) |

Les réponses doivent utiliser des codes HTTP cohérents, un format d'erreur uniforme et une version d'API (`v1`). Les opérations sensibles doivent être protégées par authentification et autorisation.

## 7. Modèle de données initial

Le schéma exact sera défini lors de l'implémentation des migrations. Les principales entités recommandées sont :

- `users` et `roles` : comptes et rôles des administrateurs.
- `devices` : identité, adresse IP, nom d'hôte, type, système, site et état courant.
- `agents` : identifiant, version, machine associée, dernière connexion et statut d'enrôlement.
- `metrics` : type de mesure, valeur, unité et horodatage.
- `alerts` : origine, gravité, description, état d'acquittement et dates.
- `networks` : sous-réseaux, passerelles, VLAN et informations de rattachement.
- `diagnostic_jobs` : type de test, cible, demandeur, statut et résultat.
- `audit_logs` : acteur, action, cible, horodatage, adresse source et résultat.

Les mesures étant potentiellement nombreuses, il faudra prévoir une politique de rétention et des index adaptés aux recherches par équipement et période.

## 8. Sécurité et contrôle d'accès

La sécurité doit être conçue dès les premiers services :

- HTTPS entre le navigateur et l'API ; TCP protégé par TLS entre backend et agents.
- Authentification des utilisateurs et des agents ; enrôlement contrôlé et révocation possible.
- Autorisations par rôle et par action, avec refus par défaut.
- Liste blanche des opérations distantes ; aucun terminal ou shell arbitraire exposé.
- Comptes de service aux privilèges minimaux sur les machines supervisées.
- Validation stricte des adresses, ports, paramètres et tailles de messages.
- Limitation du débit, délais d'expiration et protection contre les rejeux lorsque nécessaire.
- Journalisation des opérations sensibles et conservation des résultats d'exécution.
- Secrets dans des variables d'environnement ou un gestionnaire de secrets, jamais dans Git.
- Pare-feu : n'ouvrir que les ports nécessaires et documenter le sens des connexions.

## 9. Plan d'implémentation conseillé

Pour éviter de développer plusieurs services indépendamment sans contrat commun, procéder dans cet ordre :

1. **Stabiliser les contrats :** définir les modèles `Device`, `Metric`, `Alert`, les formats JSON de l'API et les messages TCP.
2. **Créer le backend Go minimal :** configuration, serveur HTTP, health check, connexion PostgreSQL et migrations.
3. **Connecter le frontend :** créer `frontend/lib/api.ts`, remplacer progressivement les données statiques de `lib/data.ts` par des appels API et gérer les états de chargement/erreur.
4. **Développer l'agent Go :** identité, enrôlement sécurisé, connexion TCP/TLS et heartbeat avant d'ajouter les collecteurs CPU/RAM/uptime/batterie.
5. **Mettre en place l'inventaire et la disponibilité :** enregistrement des PC, heartbeat et tests de joignabilité.
6. **Ajouter les métriques et alertes :** stockage, seuils configurables et acquittement persistant.
7. **Brancher les diagnostics :** commencer par Ping et vérification de ports TCP, puis ajouter DNS et traceroute.
8. **Implémenter audit et rôles :** rendre chaque action sensible traçable et contrôlée.
9. **Ajouter l'administration distante progressivement :** commencer par une ou deux tâches sans risque élevé, avec liste blanche et tests.
10. **Étendre la gestion réseau :** intégrer ensuite les équipements et protocoles adaptés au matériel réellement disponible.

À chaque étape, conserver une interface frontend utilisable et tester le service isolément avant de l'intégrer.

## 10. Lancer le frontend existant

### Prérequis

- Node.js 20 ou supérieur
- pnpm (version indiquée dans `frontend/package.json`) ou npm

### Installation et démarrage

Depuis le dossier `frontend/` :

```bash
pnpm install
pnpm dev
```

Avec npm :

```bash
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:3000` dans le navigateur.

### Scripts disponibles

| Commande | Description |
|---|---|
| `pnpm dev` | Démarrage en développement |
| `pnpm build` | Compilation de production |
| `pnpm start` | Démarrage de la version compilée |

À ce stade, seul le frontend est exécutable à partir du dépôt fourni. Le backend, les agents et la base de données devront être ajoutés avant toute supervision réelle.

## 11. Conventions de développement

- Garder les règles métier dans le backend Go, et non dans les composants React.
- Utiliser des structures et contrats partagés documentés pour les échanges API/TCP.
- Versionner les routes API et le protocole des agents.
- Ne pas mélanger les données de démonstration et les données réelles : prévoir un mode démo explicite.
- Ajouter des tests unitaires aux collecteurs, règles d'alerte, autorisations et parseurs de messages.
- Ajouter des tests d'intégration pour l'API, la base et la communication agent/backend.
- Documenter toute nouvelle variable d'environnement et tout port réseau utilisé.

## 12. Conclusion

Infracontrol dispose déjà d'une base frontend structurée couvrant les principaux écrans de supervision et d'administration. La prochaine étape consiste à lui donner un fonctionnement réel en construisant un backend Go central, un canal de communication TCP sécurisé avec des agents Go, puis la persistance des données. Cette séparation permet de conserver l'interface existante tout en ajoutant les services un par un, avec des responsabilités clairement définies et une architecture évolutive.
