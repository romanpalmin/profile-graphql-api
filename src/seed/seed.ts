import { PrismaClient } from '../generated/prisma/client.js';
import type { SeedProfile } from './seed-data.js';

// «2023-11-01» → Date в UTC: колонки date не хранят время, так дата не «съезжает» из-за часового пояса.
const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

// Идемпотентное заполнение: профиль обновляется по slug (upsert), его дочерние записи пересоздаются
// в одной транзакции. Повторный запуск даёт то же состояние базы, без дублей.
export async function seed(prisma: PrismaClient, data: SeedProfile) {
  const { slug, name, title, description, location } = data;

  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
      where: { slug },
      update: { name, title, description, location },
      create: { slug, name, title, description, location },
    });
    const profileId = profile.id;

    // Достижения удалятся каскадом вместе с опытом (onDelete: Cascade).
    await tx.link.deleteMany({ where: { profileId } });
    await tx.skill.deleteMany({ where: { profileId } });
    await tx.experience.deleteMany({ where: { profileId } });
    await tx.project.deleteMany({ where: { profileId } });

    await tx.link.createMany({
      data: data.links.map((link, sortOrder) => ({ profileId, sortOrder, ...link })),
    });
    await tx.skill.createMany({
      data: data.skills.map((skill, sortOrder) => ({ profileId, sortOrder, ...skill })),
    });
    await tx.project.createMany({
      data: data.projects.map((project, sortOrder) => ({ profileId, sortOrder, ...project })),
    });

    // Опыт создаём по одному: у каждой записи вложенные достижения.
    for (const [sortOrder, experience] of data.experiences.entries()) {
      await tx.experience.create({
        data: {
          profileId,
          sortOrder,
          company: experience.company,
          position: experience.position,
          startDate: toDate(experience.startDate),
          endDate: experience.endDate ? toDate(experience.endDate) : null,
          achievements: {
            create: experience.achievements.map((text, order) => ({ text, sortOrder: order })),
          },
        },
      });
    }
  });
}
