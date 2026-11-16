import { HelloResolver } from './hello.resolver.js';

describe('HelloResolver', () => {
  it('возвращает приветствие', () => {
    expect(new HelloResolver().hello()).toBe('Hello GraphQL!');
  });
});
