import type { Profile } from './models/profile.model.js';
import { ProfileResolver } from './profile.resolver.js';
import type { ProfileService } from './profile.service.js';

// Unit-тест слоя API: сервис подменён заглушкой, БД не нужна.
// Проверяем, что resolver только делегирует и берёт id из @Parent.
describe('ProfileResolver', () => {
  const profile = { id: 7 } as Profile;
  let service: { [K in keyof ProfileService]: ReturnType<typeof vi.fn> };
  let resolver: ProfileResolver;

  beforeEach(() => {
    service = {
      getProfile: vi.fn().mockResolvedValue(profile),
      getLinks: vi.fn().mockResolvedValue([]),
      getSkills: vi.fn().mockResolvedValue([]),
      getExperiences: vi.fn().mockResolvedValue([]),
      getProjects: vi.fn().mockResolvedValue([]),
      getAchievements: vi.fn().mockResolvedValue([]),
    };
    resolver = new ProfileResolver(service as unknown as ProfileService);
  });

  it('profile() возвращает результат сервиса', async () => {
    await expect(resolver.profile()).resolves.toBe(profile);
    expect(service.getProfile).toHaveBeenCalledOnce();
  });

  it.each([
    ['links', 'getLinks'],
    ['skills', 'getSkills'],
    ['experience', 'getExperiences'],
    ['projects', 'getProjects'],
  ] as const)('%s() запрашивает данные по id родителя', async (field, method) => {
    await resolver[field](profile);
    expect(service[method]).toHaveBeenCalledWith(7);
  });
});
