# profile-graphql-api

Цифровая визитка в виде backend-приложения: GraphQL API с профилем, ссылками, навыками, опытом работы (с достижениями) и проектами. Данные хранятся в PostgreSQL, база создаётся и заполняется автоматически при запуске. Через встроенный Apollo Sandbox можно выполнять запросы прямо в браузере.

**Стек:** TypeScript, Node.js, NestJS, GraphQL (Apollo, code-first), Prisma, PostgreSQL, Docker.

## Быстрый старт

Нужен только Docker (с Docker Compose).

```bash
git clone <адрес этого репозитория>
cd profile-graphql-api
docker compose up --build
```

Что произойдёт при первом запуске (шаги выполняются автоматически, подробности в `docker-entrypoint.sh`):

1. соберётся образ приложения и поднимется PostgreSQL;
2. применятся миграции (`prisma migrate deploy`);
3. база заполнится данными визитки (seed; повторный запуск не создаёт дублей);
4. запустится API.

Когда в логе появится `Nest application successfully started`, откройте **Apollo Sandbox**: <http://localhost:3000/graphql>

Остановить: `Ctrl+C`. Полностью удалить контейнеры и данные базы: `docker compose down -v`.

Если порты 3000 или 5432 заняты, задайте другие: `PORT=3001 DB_PORT=5433 docker compose up --build` (остальные переменные и значения по умолчанию в `.env.example`).

## Примеры запросов

Вставьте запрос в Apollo Sandbox и нажмите Run.

**1. Профиль с навыками, опытом и проектами:**

```graphql
query {
  profile {
    name
    description
    skills {
      name
    }
    experience {
      company
      position
    }
    projects {
      name
    }
  }
}
```

Фрагмент ответа:

```json
{
  "data": {
    "profile": {
      "name": "Роман Пальмин",
      "skills": [{ "name": "TypeScript" }, { "name": "JavaScript" }, { "name": "SQL" }],
      "experience": [
        { "company": "ФЛАУВАУ (Flowwow)", "position": "Старший разработчик пользовательских интерфейсов" },
        { "company": "ООО «Наука»", "position": "Ведущий разработчик" }
      ],
      "projects": [{ "name": "Palmira Lab" }, { "name": "kazan-test-task" }]
    }
  }
}
```

**2. Опыт работы с датами и достижениями (второй уровень вложенности):**

```graphql
query {
  profile {
    experience {
      company
      position
      startDate
      endDate
      achievements {
        text
      }
    }
  }
}
```

`endDate: null` означает «по настоящее время».

**3. Ссылки, навыки с уровнем и проекты с технологиями:**

```graphql
query {
  profile {
    title
    location
    links {
      label
      url
    }
    skills {
      name
      category
      level
      note
    }
    projects {
      name
      url
      description
      technologies
    }
  }
}
```

Все поля и их описания видны во вкладке Schema в Apollo Sandbox.

## Архитектура

### Структура проекта

```
src/
├── main.ts                      запуск приложения
├── app.module.ts                корневой модуль, настройка GraphQL (Apollo, контекст с лоадерами)
├── prisma/
│   ├── prisma.module.ts         модуль доступа к базе (экспортирует PrismaService)
│   └── prisma.service.ts        клиент Prisma: подключение, закрытие, подписка на SQL-запросы
├── profile/
│   ├── models/                  GraphQL-типы (Profile, Link, Skill, Experience, Achievement, Project)
│   ├── profile.resolver.ts      запрос profile и вложенные поля (ссылки, навыки, опыт, проекты)
│   ├── experience.resolver.ts   вложенное поле второго уровня: достижения
│   ├── profile.service.ts       запросы к базе (Prisma), без знания о GraphQL
│   ├── loaders/                 DataLoader для достижений и контекст GraphQL
│   └── profile.module.ts
├── seed/                        данные визитки и идемпотентное заполнение базы
└── generated/                   клиент Prisma (создаётся командой prisma generate, в git не хранится)
prisma/
├── schema.prisma                схема базы данных
└── migrations/                  миграции (применяются при старте контейнера)
```

### Слои

Каждый слой отвечает за своё и ничего не знает о слоях выше.

| Слой | Где | Отвечает за | Не знает о |
|---|---|---|---|
| API (resolver) | `*.resolver.ts` | разбор GraphQL-запроса, вызов сервиса, форма ответа | SQL, Prisma |
| Сервис | `profile.service.ts` | получение данных: запросы к базе | GraphQL, HTTP |
| Модели | `models/` | описание типов GraphQL-схемы | где хранятся данные |
| Доступ к базе | `PrismaService` | подключение и запросы к PostgreSQL | бизнес-смыслу данных |

Резолвер только делегирует сервису и берёт идентификатор родителя из `@Parent()`, поэтому его можно проверять unit-тестом без базы (`profile.resolver.spec.ts`).

### Как выполняется запрос

Запрос `{ profile { experience { company achievements { text } } } }`:

```
клиент ──► GraphQL (Apollo) ──► ProfileResolver.profile()         ──► ProfileService ──► SQL: profile       (1 запрос)
                            └─► ProfileResolver.experience()      ──► ProfileService ──► SQL: experience    (1 запрос)
                            └─► ExperienceResolver.achievements() × 12 мест работы
                                       │ loader.load(id) копит id в течение одного тика
                                       └─► ProfileService ──► SQL: achievement WHERE experience_id IN (...)  (1 запрос на все места)
```

Всего три SQL-запроса независимо от числа мест работы. Подробности решения (DataLoader, контекст на запрос) в разделе «Решения».

### База данных

Схема из шести таблиц: `profile`, `link`, `skill`, `experience`, `achievement`, `project`; два уровня вложенности `profile → experience → achievement`. ER-диаграмма и описание: [ARCHITECTURE.md](ARCHITECTURE.md).
