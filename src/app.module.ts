import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaModule } from './prisma/prisma.module.js';
import { createGraphQLContext } from './profile/loaders/graphql-context.js';
import { ProfileModule } from './profile/profile.module.js';
import { ProfileService } from './profile/profile.service.js';

@Module({
  imports: [
    PrismaModule,
    ProfileModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ProfileModule],
      inject: [ProfileService],
      useFactory: (profileService: ProfileService) => ({
        // Code-first: схема строится из TypeScript-классов и хранится в памяти.
        autoSchemaFile: true,
        sortSchema: true,
        // Apollo Sandbox на /graphql. Плагин указан явно, чтобы Sandbox открывался и в production
        // (без него Apollo в production показывает пустую страницу), introspection нужен ему для схемы.
        graphiql: false, // в Nest 14 по умолчанию включён GraphiQL, нам нужен именно Apollo Sandbox
        introspection: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
        // Функция context вызывается на КАЖДЫЙ запрос: новые лоадеры с пустым кэшем.
        context: () => createGraphQLContext(profileService),
      }),
    }),
  ],
})
export class AppModule {}
