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
    super({ adapter: new PrismaPg({ connectionString }) });
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
