import { describe, expect, it } from 'vitest';
import { ConfigError, validateEnv } from './env.js';

const valid = { DATABASE_URL: 'postgresql://u:p@localhost:5432/db?schema=public' };

describe('validateEnv', () => {
  it('принимает корректную конфигурацию, порт по умолчанию 3000', () => {
    expect(validateEnv(valid)).toEqual({ port: 3000, databaseUrl: valid.DATABASE_URL });
  });

  it('читает PORT, если он задан', () => {
    expect(validateEnv({ ...valid, PORT: '4000' }).port).toBe(4000);
  });

  it('без DATABASE_URL падает с понятной подсказкой', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL не задан.*\.env\.example/s);
  });

  it('пустой DATABASE_URL считается незаданным', () => {
    expect(() => validateEnv({ DATABASE_URL: '   ' })).toThrow(ConfigError);
  });

  it('отклоняет адрес не PostgreSQL', () => {
    expect(() => validateEnv({ DATABASE_URL: 'mysql://localhost/db' })).toThrow(/postgresql:\/\//);
  });

  it.each(['abc', '0', '70000', '3.5', '-1'])('отклоняет неверный PORT «%s»', (port) => {
    expect(() => validateEnv({ ...valid, PORT: port })).toThrow(/PORT должен быть/);
  });

  it('перечисляет ВСЕ проблемы сразу, а не только первую', () => {
    try {
      validateEnv({ PORT: 'abc' });
      expect.unreachable('должно было упасть');
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as ConfigError).problems).toHaveLength(2);
    }
  });
});
