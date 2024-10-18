# OAuth Server

Ce projet est un serveur OAuth simple utilisant Node.js et Express.

## Prérequis

- Node.js installé sur votre machine

## Installation

Pour installer les dépendances du projet, exécutez la commande suivante :

```sh
npm install

```

### Lancer le Projet

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

test
