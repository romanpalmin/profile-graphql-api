import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  // Корректная остановка: закрываем приложение (в том числе соединения с базой, см. PrismaService.onModuleDestroy)
  // и выходим с кодом 0. Явный обработчик нужен, потому что в контейнере node работает как PID 1,
  // а для PID 1 сигнал без обработчика игнорируется: docker stop ждал бы 10 секунд и убивал процесс (код 137).
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => {
      void app.close().then(() => process.exit(0));
    });
  }
}
await bootstrap();
