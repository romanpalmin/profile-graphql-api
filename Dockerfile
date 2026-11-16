# --- Ступень 1: сборка (нужны devDependencies: nest cli, typescript) ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# --- Ступень 2: боевой образ (только prod-зависимости и dist) ---
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# Не запускаем приложение от root
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
