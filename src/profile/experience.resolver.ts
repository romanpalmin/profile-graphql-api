import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Achievement } from './models/achievement.model.js';
import { Experience } from './models/experience.model.js';
import type { GraphQLContext } from './loaders/graphql-context.js';

// Отдельный resolver для вложенного поля второго уровня: Profile → Experience → Achievement.
@Resolver(() => Experience)
export class ExperienceResolver {
  @ResolveField(() => [Achievement])
  achievements(
    @Parent() experience: Experience,
    @Context() context: GraphQLContext,
  ) {
    // Не идём в базу сразу: лоадер соберёт id всех мест за тик и сделает один запрос.
    return context.loaders.achievementsByExperienceId.load(experience.id);
  }
}
