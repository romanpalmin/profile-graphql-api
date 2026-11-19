import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigError, validateEnv } from './config/env.js';

async function bootstrap() {
  // Конфигурацию проверяем до запуска Nest: при ошибке выходим сразу, перечислив все проблемы
  const config = validateEnv(process.env);

  const app = await NestFactory.create(AppModule);
  await app.listen(config.port);

  // Корректная остановка: закрываем приложение (в том числе соединения с базой, см. PrismaService.onModuleDestroy)
  // и выходим с кодом 0. Явный обработчик нужен, потому что в контейнере node работает как PID 1,
  // а для PID 1 сигнал без обработчика игнорируется: docker stop ждал бы 10 секунд и убивал процесс (код 137).
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => {
      void app.close().then(() => process.exit(0));
    });
  }
}
try {
  await bootstrap();
} catch (error) {
  // Ошибку конфигурации показываем коротким списком, без стека: он тут только мешает
  if (error instanceof ConfigError) {
    console.error(error.message);
    process.exit(1);
  }
  throw error;
}
