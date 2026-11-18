import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Слой доступа к данным: только запросы к БД, без знания о GraphQL.
// Достижения грузятся пакетно (см. loaders/): так нет N+1 на вложенном поле experience → achievements.
@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  // В базе одна визитка; slug даёт задел на несколько профилей.
  getProfile() {
    return this.prisma.profile.findFirstOrThrow({ orderBy: { id: 'asc' } });
  }

  getLinks(profileId: number) {
    return this.prisma.link.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  getSkills(profileId: number) {
    return this.prisma.skill.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  getExperiences(profileId: number) {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  getProjects(profileId: number) {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Достижения сразу нескольких мест одним запросом (IN вместо N запросов WHERE =); вызывается из DataLoader.
  getAchievementsByExperienceIds(experienceIds: readonly number[]) {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
