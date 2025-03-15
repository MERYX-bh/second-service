# Utilisation de Node.js comme base
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json en premier pour optimiser le cache
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install --omit=dev

# Copier tous les fichiers restants
COPY . .

# Exposer le port de l’application
EXPOSE 5001

# Lancer le serveur
CMD ["node","server.js"]
