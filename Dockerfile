# Utiliser une image Node.js officielle comme image de base
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY /server/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start"]