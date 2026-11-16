import { seedProfile } from './seed-data.js';

describe('seedProfile', () => {
  it('опыт идёт от новых мест к старым, периоды корректны', () => {
    const { experiences } = seedProfile;
    experiences.forEach((experience) => {
      expect(experience.achievements.length).toBeGreaterThan(0);
      if (experience.endDate) {
        expect(experience.endDate >= experience.startDate).toBe(true);
      }
    });
    const starts = experiences.map((experience) => experience.startDate);
    expect(starts).toEqual([...starts].sort().reverse());
  });

  it('у навыков и проектов нет дублей имён', () => {
    const skillNames = seedProfile.skills.map((skill) => skill.name);
    const projectNames = seedProfile.projects.map((project) => project.name);
    expect(new Set(skillNames).size).toBe(skillNames.length);
    expect(new Set(projectNames).size).toBe(projectNames.length);
  });

  it('в публичных данных нет телефона, даты рождения и упоминаний процесса найма', () => {
    // Ссылки вырезаем: в адресах резюме hh.ru есть длинные цепочки цифр, это не телефон
    const text = JSON.stringify(seedProfile).replace(/https?:\/\/\S+/g, '');
    // Ищем по общим признакам, а не по конкретным значениям: в самом тесте личных данных быть не должно
    expect(text).not.toMatch(/(?:\+7|\b8)?[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/);
    expect(text).not.toMatch(/рожд|родил/i);
    expect(text).not.toMatch(/работодател|вакан|собеседован/i);
  });
});
