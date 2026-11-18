import 'dotenv/config';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('GraphQL (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // Нужна заполненная база (npm run seed).
  it('query profile возвращает имя из базы', async () => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ profile { name } }' })
      .expect(200);
    expect(res.body).toEqual({ data: { profile: { name: 'Роман Пальмин' } } });
  });

  it('Apollo Sandbox отдаётся на GET /graphql в браузере', async () => {
    const res = await request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);
    expect(res.text).toContain('Apollo');
  });

  // Пример-запрос из условия задания, слово в слово: проверяем форму ответа и что все вложенные списки пришли.
  it('пример-запрос из задания возвращает профиль с навыками, опытом и проектами', async () => {
    const query = `query {
      profile {
        name
        description
        skills { name }
        experience { company position }
        projects { name }
      }
    }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    const { profile } = res.body.data;
    expect(profile.name).toBe('Роман Пальмин');
    expect(profile.description).toEqual(expect.any(String));
    expect(profile.skills.length).toBeGreaterThan(0);
    expect(profile.experience.length).toBeGreaterThan(0);
    expect(profile.projects.length).toBeGreaterThan(0);
    // Каждый элемент содержит запрошенные поля (строки, не null).
    for (const skill of profile.skills)
      expect(skill.name).toEqual(expect.any(String));
    for (const job of profile.experience) {
      expect(job.company).toEqual(expect.any(String));
      expect(job.position).toEqual(expect.any(String));
    }
    for (const project of profile.projects)
      expect(project.name).toEqual(expect.any(String));
  });

  // Главный риск DataLoader: перепутать достижения между местами работы. Сверяем с базой по каждому месту.
  it('достижения через DataLoader попадают к своим местам работы, в порядке sortOrder', async () => {
    const query = '{ profile { experience { id achievements { text } } } }';
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();

    const prisma = app.get(PrismaService);
    const jobs: { id: string; achievements: { text: string }[] }[] =
      res.body.data.profile.experience;
    expect(jobs.length).toBeGreaterThan(1);

    for (const job of jobs) {
      const expected = await prisma.achievement.findMany({
        where: { experienceId: Number(job.id) },
        orderBy: { sortOrder: 'asc' },
      });
      expect(job.achievements.map((a) => a.text)).toEqual(
        expected.map((a) => a.text),
      );
    }
  });

  // Защита от N+1: считаем реальные SQL-запросы к базе, а не вызовы функций.
  it('вложенный запрос experience → achievements делает 3 SQL-запроса (а не 1 + 1 + N)', async () => {
    const prisma = app.get(PrismaService);
    const queries: string[] = [];
    const unsubscribe = prisma.onQuery((sql) => queries.push(sql));

    const query =
      '{ profile { name experience { company achievements { text } } } }';
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    unsubscribe();

    const achievementQueries = queries.filter((sql) =>
      sql.includes('FROM "public"."achievement"'),
    );
    expect(achievementQueries).toHaveLength(1); // один пакетный запрос на все места
    expect(queries).toHaveLength(3); // profile + experience + achievement
  });

  // Ленивость: если клиент не просит достижения, запроса к achievement нет вообще.
  it('без поля achievements запрос к таблице achievement не выполняется', async () => {
    const prisma = app.get(PrismaService);
    const queries: string[] = [];
    const unsubscribe = prisma.onQuery((sql) => queries.push(sql));

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ profile { experience { company } } }' })
      .expect(200);
    unsubscribe();

    expect(queries.some((sql) => sql.includes('"achievement"'))).toBe(false);
  });
});
