# --- Ступень 1: сборка (нужны devDependencies: nest cli, typescript) ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY nest-cli.json tsconfig.json tsconfig.build.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
# Prisma Client не хранится в git (src/generated в .gitignore): генерируем его из schema.prisma внутри образа.
# DATABASE_URL нужен prisma.config.ts только для чтения; для generate подключение к базе не требуется.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npx prisma generate
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
