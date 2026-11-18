import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

// Один клиент Prisma на всё приложение. Наследуем PrismaClient, поэтому в других сервисах
// пишем prisma.profile.findMany(...) напрямую, без обёртки.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Не задан DATABASE_URL: скопируйте .env.example в .env.');
    }
    // Prisma 7 ходит в базу через драйвер-адаптер; пул соединений настраивается в нём.
    // PRISMA_LOG_QUERIES=true печатает каждый SQL-запрос в консоль (для разбора N+1 и отладки).
    const log = process.env.PRISMA_LOG_QUERIES === 'true' ? [{ emit: 'stdout' as const, level: 'query' as const }] : [];
    super({ adapter: new PrismaPg({ connectionString }), log });
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
