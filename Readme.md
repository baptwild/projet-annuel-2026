# Projet Annuel 2026

Application de gestion de garderie pour chiens — Backend Symfony + API Platform, Frontend Next.js, base de données MySQL, le tout orchestré via Docker.

---

## Prérequis

- [Docker](https://www.docker.com/products/docker-desktop) et Docker Compose installés
- Git

---

## Installation et démarrage

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd projet-annuel-2026
```

### 2. Lancer les containers

```bash
docker compose up --build -d
```

Cela démarre 3 services :
- `symfony_backend` → [http://localhost:8000](http://localhost:8000)
- `next_frontend` → [http://localhost:3000](http://localhost:3000)
- `mysql_db` → port 3306

### 3. Configurer les variables d'environnement locales

Crée un fichier `backend/.env.local` (ignoré par git) et génère un `APP_SECRET` personnel :

```bash
echo "APP_SECRET=$(docker compose exec backend php -r 'echo bin2hex(random_bytes(16));')" > backend/.env.local
```

> Ce fichier n'est jamais partagé — chaque développeur a son propre secret.

### 4. Installer les dépendances backend

```bash
docker compose exec backend composer install
```

### 5. Lancer les migrations

```bash
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
```

### 6. Charger les données de test (fixtures)

```bash
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

---

## Tester l'API

### Documentation interactive

Ouvre [http://localhost:8000/api](http://localhost:8000/api) pour accéder à l'interface API Platform.

### Obtenir un token JWT

**Admin :**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@happy-paws.com", "password": "admin1234"}'
```

**Utilisateur standard :**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "password"}'
```

Autres comptes disponibles : `bob@example.com`, `carol@example.com` (mot de passe : `password`)

### Appeler une route protégée

```bash
curl http://localhost:8000/api/bookings \
  -H "Authorization: Bearer <token>"
```

---

## Commandes utiles

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
docker compose down -v
docker compose up -d
docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```
