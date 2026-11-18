import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// Один клиент Prisma на всё приложение. Наследуем PrismaClient, поэтому в других сервисах
// пишем prisma.profile.findMany(...) напрямую, без обёртки.
@Injectable()
export class PrismaService
  extends PrismaClient<{
    adapter: PrismaPg;
    log: [{ emit: 'event'; level: 'query' }];
  }>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly queryListeners = new Set<(sql: string) => void>();

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Не задан DATABASE_URL: скопируйте .env.example в .env.');
    }
    // Prisma 7 ходит в базу через драйвер-адаптер; пул соединений настраивается в нём.
    // Клиент выдаёт событие на каждый SQL-запрос; дальше мы решаем, что с ним делать (см. ниже).
    super({
      adapter: new PrismaPg({ connectionString }),
      log: [{ emit: 'event', level: 'query' }],
    });

    this.$on('query', (event) => {
      for (const listener of this.queryListeners) listener(event.query);
    });
    // PRISMA_LOG_QUERIES=true печатает каждый SQL-запрос в консоль (для разбора N+1 и отладки).
    if (process.env.PRISMA_LOG_QUERIES === 'true') {
      this.onQuery((sql) => console.log(`prisma:query ${sql}`));
    }
  }

  // Подписка на каждый SQL-запрос к базе. Возвращает функцию отписки. Нужна, например, тестам: посчитать запросы.
  onQuery(listener: (sql: string) => void): () => void {
    this.queryListeners.add(listener);
    return () => this.queryListeners.delete(listener);
  }

  // Вызывается Nest после сборки графа зависимостей: падаем на старте, а не на первом запросе.
  async onModuleInit() {
    await this.$connect();
    await this.$queryRaw`SELECT 1`;
  }

  // Вызывается при остановке приложения: закрываем пул соединений.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
