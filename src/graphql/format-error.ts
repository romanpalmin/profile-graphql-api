import type { GraphQLFormattedError } from 'graphql';

const INTERNAL = 'INTERNAL_SERVER_ERROR';

/**
 * Формат ошибок GraphQL.
 * В production внутренние ошибки (сбой базы, баг в коде) наружу не показываем: в сообщении мог бы оказаться
 * текст запроса к базе или стек. Клиент получает общий текст и код, подробности остаются в логе сервера.
 * Ошибки клиента (неверный запрос, не прошла валидация) отдаём как есть: они помогают исправить запрос.
 */
export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  isProduction: boolean,
  log: (message: string) => void = () => {},
): GraphQLFormattedError {
  if (!isProduction || formatted.extensions?.code !== INTERNAL) return formatted;

  log(`Внутренняя ошибка GraphQL: ${formatted.message}`);
  return {
    message: 'Внутренняя ошибка сервера',
    path: formatted.path,
    extensions: { code: INTERNAL },
  };
}
