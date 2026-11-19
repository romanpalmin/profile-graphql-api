import type { GraphQLFormattedError } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import { formatGraphQLError } from './format-error.js';

const internal: GraphQLFormattedError = {
  message: 'Invalid `prisma.profile.findFirst()` invocation: connection refused at 10.0.0.5:5432',
  path: ['profile'],
  extensions: { code: 'INTERNAL_SERVER_ERROR', stacktrace: ['Error: ...', '    at ...'] },
};
const clientError: GraphQLFormattedError = {
  message: 'Cannot query field "nope" on type "Query".',
  extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
};

describe('formatGraphQLError', () => {
  it('в production скрывает текст и стек внутренней ошибки, оставляя код и путь', () => {
    const result = formatGraphQLError(internal, true);
    expect(result).toEqual({
      message: 'Внутренняя ошибка сервера',
      path: ['profile'],
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
    expect(JSON.stringify(result)).not.toMatch(/prisma|10\.0\.0\.5|stacktrace/);
  });

  it('в production пишет исходную ошибку в лог', () => {
    const log = vi.fn();
    formatGraphQLError(internal, true, log);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('connection refused'));
  });

  it('ошибки клиента отдаёт как есть: они помогают исправить запрос', () => {
    expect(formatGraphQLError(clientError, true)).toBe(clientError);
  });

  it('вне production ничего не скрывает, чтобы удобно отлаживать', () => {
    expect(formatGraphQLError(internal, false)).toBe(internal);
  });
});
