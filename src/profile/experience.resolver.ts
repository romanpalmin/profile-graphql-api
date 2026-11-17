import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Achievement } from './models/achievement.model.js';
import { Experience } from './models/experience.model.js';
import { ProfileService } from './profile.service.js';

// Отдельный resolver для вложенного поля второго уровня: Profile → Experience → Achievement.
@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly profileService: ProfileService) {}

  @ResolveField(() => [Achievement])
  achievements(@Parent() experience: Experience) {
    return this.profileService.getAchievements(experience.id);
  }
}
