import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ExperienceResolver } from './experience.resolver.js';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';

@Module({
  imports: [PrismaModule],
  providers: [ProfileService, ProfileResolver, ExperienceResolver],
  // AppModule берёт ProfileService, чтобы собрать GraphQL-контекст с лоадерами.
  exports: [ProfileService],
})
export class ProfileModule {}
