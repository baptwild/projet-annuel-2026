# Projet Café des Chiens - ESGI

Code Front-End

## 📋 Description

Ce projet est un site de réservation de garde de chien en ligne pour le Café des Chiens, basé au Versoud, à côté de Grenoble en Isère.
Il a été réalisé dans le cadre du projet annuel pour le cursus de Mastère en Ingénierie du Web à l'ESGI de Grenoble.

Ce projet a été réalisé par Baptiste SAUVAGE, Anita CHAUDHARY et Nicolas OSBORNE.

### 🛠️ Technologies & librairies utilisées

- **Next.js**
- **SCSS/SASS**
- **Atomic Design**

## 📋 Prérequis

Pour exécuter ce projet, assurez-vous d'avoir déjà installé les outils suivants :

- Node.js
- npm ou yarn

## 🚀 Guide d'installation

Pour lancer le front-end localement, depuis ce dossier **/frontend**, ouvrir un terminal et lancer les commandes suivantes :

### 1️⃣ Installer les dépendances :

```bash
- npm install
ou
- yarn
```

### 2️⃣ Configurer les variables d'environnement :

Dans un fichier .env.local à la racine du projet, renseigner l'accès au serveur pour la base de données (mySQL ou autre) :

```bash
DATABASE_URL="mysql://<user>:<password>@127.0.0.1:3306/<db_name>?serverVersion=8.3.0&charset=utf8mb4"
```

### 3️⃣ Lancer le projet :

Lancer ensuite la compilation du projet Next.js :

```bash
- npm run dev
ou
- yarn dev
```

## 🌐 Accéder à l'application :

L'application sera accessible à l'URL : https://localhost:3000
