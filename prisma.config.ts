import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

// Настройки CLI Prisma (generate, migrate). Адрес базы берём из DATABASE_URL (.env).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
