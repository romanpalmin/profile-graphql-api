import type DataLoader from 'dataloader';
import type { ProfileService } from '../profile.service.js';
import { createAchievementsLoader } from './achievements.loader.js';

// То, что лежит в GraphQL-контексте: создаётся заново на каждый запрос, поэтому кэш лоадеров живёт один запрос.
export interface GraphQLContext {
  loaders: {
    achievementsByExperienceId: DataLoader<
      number,
      Awaited<ReturnType<ProfileService['getAchievementsByExperienceIds']>>
    >;
  };
}

export function createGraphQLContext(
  profileService: ProfileService,
): GraphQLContext {
  return {
    loaders: {
      achievementsByExperienceId: createAchievementsLoader(profileService),
    },
  };
}
