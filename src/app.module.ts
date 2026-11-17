import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfileModule } from './profile/profile.module.js';

@Module({
  imports: [
    PrismaModule,
    ProfileModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-first: схема строится из TypeScript-классов и хранится в памяти.
      autoSchemaFile: true,
      sortSchema: true,
      // Apollo Sandbox на /graphql. Плагин указан явно, чтобы Sandbox открывался и в production
      // (без него Apollo в production показывает пустую страницу), introspection нужен ему для схемы.
      graphiql: false, // в Nest 14 по умолчанию включён GraphiQL, нам нужен именно Apollo Sandbox
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    }),
  ],
})
export class AppModule {}
