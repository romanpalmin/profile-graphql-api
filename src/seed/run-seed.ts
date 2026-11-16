import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { seed } from './seed.js';
import { seedProfile } from './seed-data.js';

// Точка входа: npm run seed (или node dist/seed/run-seed.js в контейнере после миграций).
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Не задан DATABASE_URL: скопируйте .env.example в .env.');
  }
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    await seed(prisma, seedProfile);
    const [links, skills, experiences, achievements, projects] = await Promise.all([
      prisma.link.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.achievement.count(),
      prisma.project.count(),
    ]);
    console.log(
      `База заполнена: ссылок ${links}, навыков ${skills}, опыта ${experiences}, достижений ${achievements}, проектов ${projects}.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

await main();
