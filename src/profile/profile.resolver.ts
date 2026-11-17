import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Experience } from './models/experience.model.js';
import { Link } from './models/link.model.js';
import { Profile } from './models/profile.model.js';
import { Project } from './models/project.model.js';
import { Skill } from './models/skill.model.js';
import { ProfileService } from './profile.service.js';

// Resolver принимает запрос и делегирует service; логики и обращений к БД здесь нет.
@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { description: 'Профиль-визитка' })
  profile() {
    return this.profileService.getProfile();
  }

  // @ResolveField: вызывается, только если клиент запросил это поле. @Parent — уже найденный профиль.
  @ResolveField(() => [Link])
  links(@Parent() profile: Profile) {
    return this.profileService.getLinks(profile.id);
  }

  @ResolveField(() => [Skill])
  skills(@Parent() profile: Profile) {
    return this.profileService.getSkills(profile.id);
  }

  // Имя поля по заданию — experience (в БД и сервисе — experiences).
  @ResolveField('experience', () => [Experience])
  experience(@Parent() profile: Profile) {
    return this.profileService.getExperiences(profile.id);
  }

  @ResolveField(() => [Project])
  projects(@Parent() profile: Profile) {
    return this.profileService.getProjects(profile.id);
  }
}
