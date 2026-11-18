import DataLoader from 'dataloader';
import type { ProfileService } from '../profile.service.js';

type AchievementRow = Awaited<
  ReturnType<ProfileService['getAchievementsByExperienceIds']>
>[number];

// Раскладывает плоский список строк по ключам. Результат: массив массивов в ТОМ ЖЕ порядке, что и keys
// (DataLoader требует ровно столько элементов, сколько ключей, и в том же порядке). Если у места нет
// достижений, получаем пустой массив, а не undefined.
export function groupByKey<T>(
  keys: readonly number[],
  rows: T[],
  getKey: (row: T) => number,
): T[][] {
  const byKey = new Map<number, T[]>(keys.map((key) => [key, []]));
  for (const row of rows) {
    byKey.get(getKey(row))?.push(row);
  }
  return keys.map((key) => byKey.get(key) ?? []);
}

// Один лоадер на один GraphQL-запрос (создаётся в context). Внутри пакета id собираются за один тик
// цикла событий и уходят в базу одним запросом.
export function createAchievementsLoader(profileService: ProfileService) {
  return new DataLoader<number, AchievementRow[]>(async (experienceIds) => {
    const rows =
      await profileService.getAchievementsByExperienceIds(experienceIds);
    return groupByKey(experienceIds, rows, (row) => row.experienceId);
  });
}
