# Projet Annuel 2026

Application de gestion de garderie pour chiens — Backend Symfony + API Platform, Frontend Next.js, base de données MySQL, le tout orchestré via Docker.

---

## Prérequis

- [Docker](https://www.docker.com/products/docker-desktop) et Docker Compose installés
- Git

---

## Installation et démarrage

### Méthode rapide (recommandée)

```bash
git clone <url-du-repo>
cd projet-annuel-2026
make install
```

`make install` gère tout automatiquement : démarrage des containers, attente MySQL, migrations, génération des clés JWT et chargement des fixtures de démo.

- Frontend : [http://localhost:3000](http://localhost:3000)
- Backend  : [http://localhost:8000](http://localhost:8000)
- API docs : [http://localhost:8000/api](http://localhost:8000/api)

---

### Méthode manuelle (étape par étape)

#### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd projet-annuel-2026
```

#### 2. Lancer les containers

```bash
docker compose up --build -d
```

Cela démarre 3 services :
- `symfony_backend` → [http://localhost:8000](http://localhost:8000)
- `next_frontend` → [http://localhost:3000](http://localhost:3000)
- `mysql_db` → port 3306

#### 3. Attendre que MySQL soit prêt

```bash
until docker compose exec db mysqladmin ping -uroot -proot --silent 2>/dev/null; do sleep 2; done
```

#### 4. Lancer les migrations

```bash
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
```

#### 5. Générer les clés JWT

> Les clés JWT ne sont **jamais** committées (`.gitignore`). Chaque développeur doit les générer localement.

```bash
docker compose exec backend php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction
```

#### 6. Charger les données de test (fixtures)

```bash
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

---

## Tester l'API

### Documentation interactive

Ouvre [http://localhost:8000/api](http://localhost:8000/api) pour accéder à l'interface API Platform.

### Comptes de démo

**Le Café des chiens** (facturation horaire, capacité 5 chiens/jour, remise hebdo dès 3 résa)

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@cafe-des-chiens.fr | admin1234 |
| Alice (Rex) | alice@example.com | password |
| Bob (Bella) | bob@example.com | password |
| Carol (Max, Chloé) | carol@example.com | password |
| David (Luna, Milo) | david@example.com | password |
| Emma (Nala) | emma@example.com | password |
| François (Oscar) | francois@example.com | password |
| Gabrielle (Perle, Filou) | gabrielle@example.com | password |
| Hugo (Rocky) | hugo@example.com | password |
| Isabelle (Titou) | isabelle@example.com | password |
| Jules (Ulysse) | jules@example.com | password |
| Karine (Venus) | karine@example.com | password |

**Woof Valley** (autre tenant — isolation multi-garderie)

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@woof-valley.com | admin1234 |
| Eve (Lola) | eve@example.com | password |
| Félix (Dino, Paco) | felix@example.com | password |

### Obtenir un token JWT

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cafe-des-chiens.fr", "password": "admin1234"}'
```

### Appeler une route protégée

```bash
curl http://localhost:8000/api/bookings \
  -H "Authorization: Bearer <token>"
```

---

## Commandes utiles

### Makefile

| Commande | Description |
|---|---|
| `make install` | Installation complète depuis zéro |
| `make up` | Démarrer les containers |
| `make down` | Arrêter les containers |
| `make reset` | Reset complet (supprime la BDD et réinstalle) |
| `make logs` | Suivre tous les logs |
| `make jwt` | Régénérer les clés JWT |
| `make fixtures` | Recharger les fixtures |
| `make cache-clear` | Vider le cache Symfony + restart backend |
| `make test-setup` | Migrer la base de test (`app_test`) — à lancer une fois après `make install` |
| `make test` | Lancer la suite PHPUnit (backend) |

### Docker direct

| Commande | Description |
|---|---|
| `docker compose up --build -d` | Démarrer tous les services |
| `docker compose down` | Arrêter les services |
| `docker compose down -v` | Arrêter et supprimer les volumes (reset BDD) |
| `docker compose logs -f backend` | Suivre les logs backend |
| `docker compose logs -f frontend` | Suivre les logs frontend |
| `docker compose exec backend php bin/console <cmd>` | Lancer une commande Symfony |
| `docker compose exec backend composer require <pkg>` | Ajouter un package Composer |

---

## Tests (backend)

Le backend utilise PHPUnit pour les tests unitaires et fonctionnels. La base de données de test (`app_test`) est séparée de la base de dev (`app`) et est réinitialisée automatiquement entre chaque test (transaction annulée après coup, via `dama/doctrine-test-bundle`) — aucune donnée ne persiste, la base de dev n'est jamais touchée.

```bash
make test-setup   # une seule fois après make install / make reset (migre app_test)
make test          # lance toute la suite
```

- `tests/Unit/` : tests unitaires purs, sans base de données (ex. logique `isPending()` / `isCancellable()` sur `Booking`)
- `tests/Functional/` : tests bout-en-bout via de vraies requêtes HTTP (`WebTestCase`), couvrant l'authentification, la création de réservation (dont le blocage double-réservation même chien/jour), l'isolation multi-tenant (un admin ne voit jamais les données d'une autre garderie) et le calcul d'occupation

---

## Architecture

```
projet-annuel-2026/
├── docker-compose.yml
├── backend/              # Symfony 8 + API Platform
│   ├── src/
│   │   ├── Entity/       # User, Dog, Daycare, Booking
│   │   ├── Controller/   # LoginController, RegisterController, MeController
│   │   ├── Enum/         # BookingStatus
│   │   └── DataFixtures/ # Données de test
│   ├── config/
│   │   └── packages/     # security.yaml, doctrine.yaml, lexik_jwt...
│   └── migrations/
└── frontend/             # Next.js 16
    └── src/
        ├── app/
        ├── components/
        └── hooks/
```

### Services

| Service | Technologie | Port |
|---|---|---|
| Backend | Symfony 8 + API Platform + JWT | 8000 |
| Frontend | Next.js 16 | 3000 |
| Base de données | MySQL 8 | 3306 |

### Credentials base de données

| Paramètre | Valeur |
|---|---|
| Host | `db` (interne Docker) / `localhost` (externe) |
| Base | `app` |
| Utilisateur | `symfony` |
| Mot de passe | `symfony` |
| Root password | `root` |

---

## Résolution de problèmes courants

**Le frontend affiche une erreur au démarrage**
```bash
docker compose rm -sf frontend && docker compose up --build -d frontend
```

**Erreur de connexion à la base de données**
Vérifier que `DATABASE_URL` dans `backend/.env` contient bien :
```
DATABASE_URL="mysql://symfony:symfony@db:3306/app?serverVersion=8.0.32&charset=utf8mb4"
```

**Vider le cache Symfony**
```bash
docker compose exec backend php bin/console cache:clear
```

**Réinitialiser complètement la base de données**
```bash
make reset
```
ou manuellement :
```bash
docker compose down -v
docker compose up -d
until docker compose exec db mysqladmin ping -uroot -proot --silent 2>/dev/null; do sleep 2; done
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec backend php bin/console lexik:jwt:generate-keypair --overwrite --no-interaction
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

---

## Guide de découverte — toutes les features

### 1. Inscription et connexion

- Aller sur [http://localhost:3000/register](http://localhost:3000/register)
- Créer un compte sur **Le Café des chiens** avec prénom, nom, email et mot de passe
- Vérifier la redirection automatique vers `/me` après inscription
- Se déconnecter, puis tenter d'accéder à `/register` en étant connecté → redirection automatique
- Se reconnecter sur [http://localhost:3000/login](http://localhost:3000/login)

---

### 2. Espace utilisateur — `/me`

- Visualiser son profil (nom, email, garderie)
- **Ajouter un chien** : nom, race, date de naissance → le chien apparaît dans la liste
- Visualiser ses réservations passées et à venir avec leur statut (En attente / Confirmée / Terminée / Annulée)

---

### 3. Faire une réservation — `/booking`

Se connecter en tant qu'**Alice** (`alice@example.com` / `password`) pour avoir le plus de contexte.

- Sélectionner un chien, une date et des horaires
- **Choisir un jour déjà chargé** (ex : lundi de la semaine courante) → le panneau d'occupation s'affiche avec les chiens déjà inscrits ce jour-là (Rex, Bella, Luna, Oscar, Nala)
- **Choisir mardi de la semaine prochaine** → voir la barre de capacité à 5/5, message "garderie complète", la réservation reste possible malgré tout
- Tenter de réserver **Rex deux fois le même jour** → message d'erreur "Rex a déjà une réservation ce jour-là"
- Soumettre une réservation valide → message de confirmation, redirection vers `/me`

---

### 4. Administration — `/admin` — Réservations

Se connecter en tant qu'**admin Le Café des chiens** (`admin@cafe-des-chiens.fr` / `admin1234`).

**Navigation par semaine**
- Les chevrons `‹` `›` permettent de naviguer semaine par semaine
- Le badge sur "En attente" indique le nombre de demandes à traiter pour la semaine affichée
- Bouton "Aujourd'hui" pour revenir à la semaine courante

**Onglets de statut**
- **En attente** : réservations soumises par les utilisateurs, à confirmer ou annuler
- Cliquer **Confirmer** sur une réservation → elle passe dans l'onglet "Confirmées"
- Cliquer **Annuler** → elle passe dans "Annulées"
- **Confirmées** : réservations dont les dates sont passées affichent le bouton **Terminer** → cliquer pour passer en "Terminées"
- **Terminées** / **Annulées** / **Toutes** : vues historiques

**Revenus du mois**
- La carte de revenus affiche le chiffre d'affaires total du mois en cours
- Détail **Réalisé** (réservations terminées) vs **À venir** (confirmées + en attente)
- La remise hebdomadaire (−10% dès 3 réservations/semaine) s'applique automatiquement dans le calcul — visible sur les semaines où Rex a 3 réservations

---

### 5. Administration — Paramètres — `/admin` › Horaires

- Modifier les horaires d'ouverture / fermeture
- Activer/désactiver le **tarif dégressif** (ex : 4€/h jusqu'à 6h, puis 3€/h)
- Activer la **remise hebdomadaire** et changer le seuil ou le pourcentage
- Modifier la **capacité maximale par jour** (actuellement 5) → vérifier l'effet immédiat sur la page `/booking`
- Enregistrer → succès affiché

---

### 6. Isolation multi-tenant

- Se connecter en tant qu'**admin Woof Valley** (`admin@woof-valley.com` / `admin1234`)
- Vérifier que seules les réservations de Woof Valley apparaissent (Eve, Félix, Grace — pas Alice ni Bob)
- Se connecter en tant qu'**Eve** (`eve@example.com`) → elle ne voit que ses propres données, pas celles du Café des chiens
