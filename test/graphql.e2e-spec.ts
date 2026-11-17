import 'dotenv/config';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('GraphQL (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // Нужна заполненная база (npm run seed); полноценные e2e по профилю — в фазе 5.
  it('query profile возвращает имя из базы', async () => {
    const res = await request(app.getHttpServer()).post('/graphql').send({ query: '{ profile { name } }' }).expect(200);
    expect(res.body).toEqual({ data: { profile: { name: 'Роман Пальмин' } } });
  });

  it('Apollo Sandbox отдаётся на GET /graphql в браузере', async () => {
    const res = await request(app.getHttpServer()).get('/graphql').set('Accept', 'text/html').expect(200);
    expect(res.text).toContain('Apollo');
  });
});
