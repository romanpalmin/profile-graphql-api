// Данные визитки. Только то, что есть в публичных резюме и репозиториях: без телефона, адреса и даты рождения.
// Даты опыта указаны с точностью до месяца (первое число начала и последнее число окончания).

export type SkillLevelName = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

export interface SeedLink {
  label: string;
  url: string;
}

export interface SeedSkill {
  name: string;
  category: string;
  level?: SkillLevelName;
  note?: string;
}

export interface SeedExperience {
  company: string;
  position: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // не указано = по настоящее время
  achievements: string[];
}

export interface SeedProject {
  name: string;
  url: string;
  description: string;
  technologies: string[];
}

export interface SeedProfile {
  slug: string;
  name: string;
  title: string;
  description: string;
  location: string;
  links: SeedLink[];
  skills: SeedSkill[];
  experiences: SeedExperience[];
  projects: SeedProject[];
}

const PERSONAL = 'личные проекты';

export const seedProfile: SeedProfile = {
  slug: 'roman-palmin',
  name: 'Роман Пальмин',
  title: 'Fullstack / AI Developer (Node.js / Nest.js / Vue / React)',
  description:
    'Fullstack-разработчик с фокусом на TypeScript, Node.js/NestJS, Vue/Nuxt и React/Next.js. ' +
    '12+ лет веду фронтенд-разработку (из них 10+ на Vue/Nuxt и TypeScript), 10+ лет работаю с базами данных: ' +
    'Oracle (PL/SQL), MS SQL Server, PostgreSQL. Последний личный проект Palmira Lab: Next.js, NestJS, Prisma ' +
    'и PostgreSQL в Docker Compose за nginx с HTTPS. Ежедневно работаю с Claude Code: критически оцениваю ' +
    'сгенерированный код и принимаю его только после проверки.',
  location: 'Санкт-Петербург',
  links: [
    { label: 'GitHub', url: 'https://github.com/romanpalmin' },
    { label: 'Email', url: 'mailto:roman.palmin@gmail.com' },
    { label: 'Telegram', url: 'https://t.me/jromkin' },
    { label: 'Сайт и блог', url: 'https://romkin.blog' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/roman-palmin' },
    { label: 'Резюме на hh.ru: Fullstack / AI', url: 'https://hh.ru/resume/82399b53ff113efc240039ed1f324d4c58756f' },
    { label: 'Резюме на hh.ru: Fullstack', url: 'https://hh.ru/resume/77e30485ff10dccd2d0039ed1f6a5233585231' },
    { label: 'Резюме на hh.ru: Frontend', url: 'https://hh.ru/resume/1abc5f19ff020113060039ed1f796c32454363' },
    { label: 'Резюме на hh.ru: Backend / SQL', url: 'https://hh.ru/resume/0bfd569aff10e7297a0039ed1f544342695575' },
  ],
  skills: [
    { name: 'TypeScript', category: 'Языки', level: 'ADVANCED' },
    { name: 'JavaScript', category: 'Языки', level: 'ADVANCED', note: 'ES5 — ES2023' },
    { name: 'SQL', category: 'Языки', level: 'ADVANCED' },

    { name: 'Node.js', category: 'Backend', level: 'INTERMEDIATE' },
    { name: 'NestJS', category: 'Backend', level: 'INTERMEDIATE', note: PERSONAL },
    { name: 'Prisma', category: 'Backend', level: 'INTERMEDIATE', note: PERSONAL },
    { name: 'GraphQL', category: 'Backend', level: 'BASIC', note: PERSONAL },
    { name: 'REST API', category: 'Backend', level: 'INTERMEDIATE' },
    { name: 'WebSocket', category: 'Backend', level: 'INTERMEDIATE' },

    { name: 'PostgreSQL', category: 'Базы данных', level: 'INTERMEDIATE' },
    { name: 'MS SQL Server (T-SQL)', category: 'Базы данных', level: 'INTERMEDIATE' },
    { name: 'Oracle (PL/SQL)', category: 'Базы данных', level: 'INTERMEDIATE' },

    { name: 'Vue.js 2/3', category: 'Frontend', level: 'ADVANCED' },
    { name: 'Nuxt, SSR', category: 'Frontend', level: 'ADVANCED' },
    { name: 'Pinia, Vuex', category: 'Frontend', level: 'ADVANCED' },
    { name: 'React', category: 'Frontend', level: 'INTERMEDIATE' },
    { name: 'Next.js', category: 'Frontend', level: 'INTERMEDIATE' },
    { name: 'CSS, SCSS', category: 'Frontend', level: 'ADVANCED' },
    { name: 'Tailwind CSS', category: 'Frontend', level: 'INTERMEDIATE' },

    { name: 'Docker', category: 'Инфраструктура', level: 'INTERMEDIATE', note: PERSONAL },
    { name: 'Docker Compose', category: 'Инфраструктура', level: 'INTERMEDIATE', note: PERSONAL },
    { name: 'Nginx', category: 'Инфраструктура', level: 'INTERMEDIATE', note: PERSONAL },
    { name: 'GitHub Actions', category: 'Инфраструктура', level: 'INTERMEDIATE' },
    { name: 'Git', category: 'Инфраструктура', level: 'INTERMEDIATE' },

    { name: 'Vitest, Testing Library, MSW', category: 'Тестирование', level: 'INTERMEDIATE' },
    { name: 'Cypress', category: 'Тестирование', level: 'INTERMEDIATE' },

    { name: 'Claude Code', category: 'AI', level: 'ADVANCED' },
    { name: 'LLM, Prompt Engineering', category: 'AI', level: 'INTERMEDIATE' },

    { name: 'Русский', category: 'Языки общения', note: 'родной' },
    { name: 'Английский', category: 'Языки общения', note: 'читаю свободно, пишу на уровне B2, разговорный подтягиваю' },
  ],
  experiences: [
    {
      company: 'ФЛАУВАУ (Flowwow)',
      position: 'Старший разработчик пользовательских интерфейсов',
      startDate: '2023-11-01',
      endDate: '2026-07-31',
      achievements: [
        'Фронтенд крупного e-commerce маркетплейса (SSR, мультиязычность и мультивалютность): Nuxt.js 2, Vue 2.7, TypeScript.',
        'Спроектировал и реализовал модуль чатов покупателей с магазинами и службой поддержки: real-time на Centrifuge (WebSocket), две итерации по ~4 месяца.',
        'Реализовал настраиваемую страницу магазина под бренд партнёра и страницу списка заказов с обновлением статусов в реальном времени.',
        'Поддерживал схему аналитики более чем на 500 событий в GTM и поэтапно мигрировал события на Яндекс.Метрику с сохранением обратной совместимости.',
        'Реализовал фронтенд-логику A/B-тестов; участвовал в релизах, разбирал инциденты через Sentry и Kibana.',
      ],
    },
    {
      company: 'ООО «Наука»',
      position: 'Ведущий разработчик',
      startDate: '2022-08-01',
      endDate: '2023-10-31',
      achievements: [
        'Корпоративный мессенджер и планировщик: клиентская часть и административная панель на Vue 2/3.',
        'Техническое лидерство небольшой команды фронтенда: код-ревью (моё одобрение было условием слияния), декомпозиция задач.',
        'Поддерживал e2e-тесты на Cypress для ключевых пользовательских сценариев.',
        'Как специалист по базам данных участвовал в миграции серверной логики с Oracle на PostgreSQL: адаптация конструкций PL/SQL (NVL → COALESCE, DECODE → CASE WHEN, SYSDATE → NOW и др.).',
      ],
    },
    {
      company: 'CoinLoan',
      position: 'Фронтенд-разработчик',
      startDate: '2021-12-01',
      endDate: '2022-08-31',
      achievements: [
        'Веб-клиент и лендинг крипто-платформы для кредитования на Vue и Nuxt.js.',
        'Интеграция с backend-API (REST) для операций с аккаунтом и продуктами платформы.',
      ],
    },
    {
      company: 'ЛЕНВЕНДО',
      position: 'Фронтенд-разработчик',
      startDate: '2018-07-01',
      endDate: '2021-04-30',
      achievements: [
        'Фронтенд e-commerce и корпоративных сайтов крупных брендов (МТС, Магнит, Перекрёсток, Совкомбанк Страхование, Газпромбанк, Эльдорадо).',
        'Аудит фронтенд-части проектов с рекомендациями по оптимизации.',
        'Участвовал в оценке тестовых заданий и в технических интервью на позиции фронтенд-разработчика.',
      ],
    },
    {
      company: 'ХК «Конкорд» (кейтеринговая группа)',
      position: 'Ведущий разработчик',
      startDate: '2016-10-01',
      endDate: '2017-12-31',
      achievements: [
        'Единственный JS-разработчик в проекте автоматизации спортбара: приложения для планшетов официантов и посетителей на Vue + Vuex, Framework7 и Cordova.',
        'Интеграция с бэкендом на 1С через PHP-эндпоинт; запуск в бой за 2,5 месяца.',
      ],
    },
    {
      company: 'Медлайнсофт',
      position: 'Разработчик',
      startDate: '2014-10-01',
      endDate: '2016-07-31',
      achievements: [
        'SPA информационной медицинской системы, вёрстка шаблонов, рефакторинг модулей на AngularJS.',
        'Скрипты импорта и экспорта на Node.js, системные скрипты на Gulp.',
      ],
    },
    {
      company: 'НИЦ СПб ЭТУ',
      position: 'Инженер-программист баз данных',
      startDate: '2013-10-01',
      endDate: '2014-06-30',
      achievements: [
        'Разработка и оптимизация БД на Oracle 11g: сложные SQL-запросы, процедуры, функции, пакеты и триггеры на PL/SQL.',
        'Системы импорта и экспорта данных, сбор и анализ требований.',
      ],
    },
    {
      company: 'ЗАО «Санкт-Петербургская судостроительная компания»',
      position: 'Программист',
      startDate: '2012-10-01',
      endDate: '2013-03-31',
      achievements: [
        'Разработка и оптимизация БД на PostgreSQL, функции БД, логика на стороне сервера.',
        'Технологическое программное обеспечение на C# (WinForms), системы импорта и экспорта данных.',
      ],
    },
    {
      company: 'НТК-Интурист',
      position: 'Программист',
      startDate: '2010-07-01',
      endDate: '2012-10-31',
      achievements: [
        'Системы онлайн-бронирования и модули поиска туров (ASP.NET, C#, jQuery); бизнес-логика на сервере в MS SQL 2005.',
        'Оптимизация клиентской части систем под популярные браузеры.',
      ],
    },
    {
      company: 'General Satellite',
      position: 'Программист (архитектор БД и приложения ERP-системы)',
      startDate: '2008-07-01',
      endDate: '2010-09-30',
      achievements: [
        'Спроектировал архитектуру базы данных и приложения внутренней ERP-системы компании.',
        'Хранимые процедуры и бизнес-логика на стороне сервера (MS SQL 2005), клиентская часть на ASP.NET и C#.',
      ],
    },
    {
      company: 'Русский Мир, СК',
      position: 'Программист',
      startDate: '2004-09-01',
      endDate: '2008-04-30',
      achievements: [
        'Сложные SQL-запросы и хранимые процедуры (MS SQL 2000, Sybase ASA), подготовка внешней отчётности.',
        'Хранилище данных (OLAP, MS SQL 2005), утилиты обслуживания баз на C# (WinForms).',
      ],
    },
    {
      company: 'Комита, ЗАО',
      position: 'Программист',
      startDate: '2002-06-01',
      endDate: '2003-08-31',
      achievements: [
        'Формы отчётности для налоговых органов в Oracle Forms 6i (Oracle9i), тестирование, документация.',
      ],
    },
  ],
  projects: [
    {
      name: 'Palmira Lab',
      url: 'https://github.com/palmiralab/palmira-lab',
      description:
        'Сайт студии автоматизации и ИИ-решений: Next.js 16 и React 19, NestJS 12, Prisma 7, PostgreSQL, ' +
        'Docker Compose за nginx с HTTPS, CI на GitHub Actions, 294 теста. ИИ-чат на GigaChat со структурированным ' +
        'выводом и защитой от prompt injection. Инфраструктуру собирал вместе с Claude Code.',
      technologies: ['Next.js', 'React', 'NestJS', 'Prisma', 'PostgreSQL', 'Docker Compose', 'GitHub Actions'],
    },
    {
      name: 'kazan-test-task',
      url: 'https://github.com/romanpalmin/kazan-test-task',
      description:
        'Тестовое задание: магазин цифровых товаров, backend на Node.js с упором на однократную выдачу ключей под гонками, ' +
        'восстановление после сбоя и промокоды с лимитом использований.',
      technologies: ['Node.js', 'JavaScript', 'SQL'],
    },
    {
      name: 'messenger-web-client',
      url: 'https://github.com/romanpalmin/messenger-web-client',
      description:
        'Тестовое задание: веб-чат на React 19 и TypeScript поверх GREEN-API (Telegram), long polling, 97 тестов, CI. ' +
        'Демо: https://demo-messenger.palmira-lab.online/',
      technologies: ['React', 'TypeScript', 'Vite', 'Vitest', 'MSW', 'GitHub Actions'],
    },
    {
      name: 'parts-search-client',
      url: 'https://github.com/romanpalmin/parts-search-client',
      description:
        'Тестовое задание: поиск автозапчастей по артикулу в два этапа на React 19 и Redux Toolkit; Vitest, Testing Library, MSW, CI. ' +
        'Стенд: https://parts-search.palmira-lab.online/',
      technologies: ['React', 'Redux Toolkit', 'Vitest', 'MSW', 'GitHub Actions'],
    },
    {
      name: 'romkin.blog',
      url: 'https://github.com/romanpalmin/romkinblog-vue',
      description:
        'Личный блог на Nuxt 3, Vue 3 (Composition API, TypeScript) и Nuxt Content; статический сайт, деплой через GitHub Actions. ' +
        'Сайт: https://romkin.blog',
      technologies: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Nuxt Content', 'GitHub Actions'],
    },
    {
      name: 'Сайт клиники',
      url: 'https://github.com/klinika-zdorovya/web',
      description: 'Коммерческий сайт клиники на Nuxt 3 с Nuxt Content и Tailwind, статическая генерация.',
      technologies: ['Nuxt 3', 'Vue 3', 'Nuxt Content', 'Tailwind CSS'],
    },
  ],
};
