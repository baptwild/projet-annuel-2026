# Récapitulatif de l’environnement

## 1. Objectif du setup

Ce projet utilise Docker pour standardiser et simplifier l’environnement de développement.

L’objectif est de permettre à n’importe quel développeur de :

* Lancer le projet en une seule commande
* Avoir exactement le même environnement (PHP, Node.js, MySQL)
* Éviter les problèmes de configuration locale
* Faciliter le passage en production

---

## 2. Architecture globale

Le projet est composé de 3 services principaux :

### Backend

* Symfony + API Platform
* Expose une API REST
* Connecté à la base de données MySQL

### Frontend

* Next.js (React)
* Consomme l’API Symfony

### Base de données

* MySQL
* Stocke toutes les données applicatives

---

## 3. Structure du projet

```
projet/
│
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── src/
│   ├── config/
│   └── .env
│
├── frontend/
│   ├── Dockerfile
│   ├── app/
│   └── package.json
│
└── (volumes Docker)
```

---

## 4. Docker Compose (orchestration)

Le fichier `docker-compose.yml` définit les services :

### Services définis

* **backend** : application Symfony
* **frontend** : application Next.js
* **db** : base de données MySQL

### Rôle de Docker Compose

Il permet de :

* Lancer tous les services ensemble
* Gérer le réseau interne entre les containers
* Gérer les ports exposés
* Gérer les volumes (persistances)

---

## 5. Backend Symfony (Docker)

### Dockerfile

Le backend utilise PHP dans un container Docker.

Fonctionnement :

* Installation de PHP et extensions nécessaires
* Installation de Composer
* Installation des dépendances Symfony
* Lancement du serveur PHP intégré

### Points importants

* Le service MySQL est accessible via le nom `db`
* Symfony lit les variables d’environnement depuis `.env`

Exemple :

```
DATABASE_URL=mysql://symfony:symfony@db:3306/app
```

---

## 6. Frontend Next.js (Docker)

### Dockerfile

Le frontend utilise Node.js dans un container.

Fonctionnement :

* Installation des dépendances npm
* Lancement du serveur de développement Next.js

### Communication avec le backend

Le frontend appelle l’API Symfony via :

```
http://localhost:8000
```

---

## 7. Base de données MySQL

Le service MySQL est lancé via une image officielle Docker.

### Configuration

* Nom du service : `db`
* Base de données : `app`
* Utilisateur : `symfony`
* Mot de passe : `symfony`

### Persistance

Les données sont stockées dans un volume Docker pour éviter la perte des données.

---

## 8. Lancement du projet

Pour démarrer le projet :

```bash
docker compose up --build
```

Pour arrêter :

```bash
docker compose down
```

Pour supprimer les volumes (reset complet) :

```bash
docker compose down -v
```

---

## 9. Accès aux services

Une fois lancé :

* Frontend (Next.js) : [http://localhost:3000](http://localhost:3000)
* Backend (Symfony API) : [http://localhost:8000](http://localhost:8000)
* API Platform docs : [http://localhost:8000/api](http://localhost:8000/api)

---

## 10. Pourquoi utiliser Docker ?

### Avantages en développement

* Plus de problèmes d’installation (PHP, Node, MySQL)
* Même environnement pour toute l’équipe
* Installation rapide
* Isolation du projet

### Avantages en production

* Même configuration qu’en local
* Déploiement reproductible
* Moins de “ça marche sur ma machine”
* Scalabilité plus simple (containers indépendants)

---

## 11. Passage en production (évolutivité)

Ce setup est conçu pour évoluer facilement vers une architecture production :

### Possibilités futures

* Remplacement du serveur PHP par PHP-FPM
* Ajout de Nginx en reverse proxy
* Ajout de HTTPS (Let's Encrypt)
* Utilisation d’un orchestrateur (Docker Swarm ou Kubernetes)
* Séparation des environnements (dev / staging / prod)

---

## 12. Résumé

Ce projet repose sur une architecture moderne :

* Symfony + API Platform pour le backend
* Next.js pour le frontend
* MySQL pour la base de données
* Docker pour l’environnement global

L’objectif est d’avoir un projet :

* simple à lancer
* reproductible
* scalable
* prêt pour la production

---

## 13. Commande principale

```bash
docker compose up --build
```
