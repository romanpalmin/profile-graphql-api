import { Query, Resolver } from '@nestjs/graphql';

// Временный resolver шага 2: проверяем, что GraphQL и Sandbox работают. Заменим на Profile.
@Resolver()
export class HelloResolver {
  @Query(() => String, { description: 'Проверка, что API живо' })
  hello(): string {
    return 'Hello GraphQL!';
  }
}
