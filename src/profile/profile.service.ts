import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Слой доступа к данным: только запросы к БД, без знания о GraphQL.
// Пока наивная версия (по одному запросу на каждое вложенное поле): в фазе 4 заменим на пакетную.
@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  // В базе одна визитка; slug даёт задел на несколько профилей.
  getProfile() {
    return this.prisma.profile.findFirstOrThrow({ orderBy: { id: 'asc' } });
  }

  getLinks(profileId: number) {
    return this.prisma.link.findMany({ where: { profileId }, orderBy: { sortOrder: 'asc' } });
  }

  getSkills(profileId: number) {
    return this.prisma.skill.findMany({ where: { profileId }, orderBy: { sortOrder: 'asc' } });
  }

  getExperiences(profileId: number) {
    return this.prisma.experience.findMany({ where: { profileId }, orderBy: { sortOrder: 'asc' } });
  }

  getProjects(profileId: number) {
    return this.prisma.project.findMany({ where: { profileId }, orderBy: { sortOrder: 'asc' } });
  }

  getAchievements(experienceId: number) {
    return this.prisma.achievement.findMany({
      where: { experienceId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
