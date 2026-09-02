FROM node:24-slim

# openssl : requis par le moteur de migration Prisma
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Couche dépendances : invalidée uniquement si package.json / lockfile changent.
# npm ci (et non install) pour une build reproductible — nécessite package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci

# Client Prisma : ne dépend que du schéma, pas du reste du code.
# `prisma generate` n'a pas besoin de DATABASE_URL (vérifié), donc pas de secret au build.
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

ENV NODE_ENV=production
ENV TZ=Europe/Paris

# node:24-slim fournit déjà un utilisateur non-root `node`
USER node

# Les migrations sont appliquées au démarrage, avant le bot.
CMD ["sh", "-c", "npx prisma migrate deploy && exec node index.js"]
