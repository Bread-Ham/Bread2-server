# Membres de l'équipe
- Anthony MINI
- Alexandre BERNARDINI
- Benjamin GLEITZ
- Clément ROLLIN

# OAuth Server

Ce projet est un serveur OAuth utilisant Node.js et Express, avec une architecture client-serveur.

## Prérequis

- Node.js v21.7.3
- npm v10.5.0
- Docker et Docker Compose pour la base de données

Pour vérifier vos versions :

```sh
node --version  # Doit afficher v21.7.3
npm --version   # Doit afficher 10.5.0
```

## Installation et Configuration

### 1. Base de données

Dans le dossier `server`, lancez la base de données avec Docker :

```sh
cd server
docker-compose up -d
```

Note : Assurez-vous de copier le fichier `.env.template` vers `.env` et de le configurer avec vos paramètres :

```sh
cp .env.template .env
```

### 2. Installation des dépendances

Installation des dépendances du serveur :

```sh
cd server
npm install
```

Installation des dépendances du client :

```sh
cd client
npm install
```

### 3. Configuration de la base de données

Dans le dossier `server`, exécutez les commandes suivantes :

```sh
# Lancer les migrations
npm run db:migrate

# Ajouter les données de test
npm run db:seed
```

### 4. Lancer le Projet

Dans le dossier `server` :

```sh
npm run start
```

Dans le dossier `client` :

```sh
npm run start
```

## Gestion des Pull Requests

1. Créez une branche dédiée (à partir de staging) pour chaque nouvelle fonctionnalité ou correction de bug.
2. Une fois le travail terminé, ouvrez une Pull Request (PR) de votre branche dédiée vers la branche `staging`.
3. Après validation et approbation de la PR, mergez la branche dédiée dans `staging`.
4. Créez ensuite une PR pour merger `staging` dans `main`.
5. Une fois la PR approuvée, mergez `staging` dans `main`.

Cela garantit que toutes les modifications sont d'abord testées sur `staging` avant d'être déployées sur `main`.
