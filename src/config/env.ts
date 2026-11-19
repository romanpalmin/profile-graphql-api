// Проверка переменных окружения при старте. Приложение падает сразу и с понятным списком всех проблем,
// а не через минуту с непонятной ошибкой подключения к базе.

export interface AppConfig {
  port: number;
  databaseUrl: string;
}

export class ConfigError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Неверная конфигурация:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
    this.name = 'ConfigError';
  }
}

export function validateEnv(env: NodeJS.ProcessEnv): AppConfig {
  const problems: string[] = [];

  const databaseUrl = env.DATABASE_URL?.trim() ?? '';
  if (!databaseUrl) {
    problems.push('DATABASE_URL не задан: скопируйте .env.example в .env');
  } else if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
    problems.push('DATABASE_URL должен начинаться с postgresql:// (используется PostgreSQL)');
  }

  // PORT необязателен (по умолчанию 3000), но если задан, то это целое число в допустимом диапазоне
  let port = 3000;
  if (env.PORT !== undefined && env.PORT !== '') {
    const parsed = Number(env.PORT);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
      problems.push(`PORT должен быть целым числом от 1 до 65535, получено «${env.PORT}»`);
    } else {
      port = parsed;
    }
  }

  if (problems.length > 0) throw new ConfigError(problems);
  return { port, databaseUrl };
}
