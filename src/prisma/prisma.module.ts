import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// Модуль-обёртка: другие модули импортируют PrismaModule и получают PrismaService через DI.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
