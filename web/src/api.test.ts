import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, fetchProfile } from './api'
import { profileFixture } from './testing/profile.fixture'

// Подменяем глобальный fetch: сеть не нужна, проверяем только разбор ответа.
function mockFetch(status: number, body: unknown, raw?: string) {
  const fn = vi.fn().mockResolvedValue(new Response(raw ?? JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => vi.unstubAllGlobals())

describe('fetchProfile', () => {
  it('возвращает профиль и шлёт POST на /graphql с запросом', async () => {
    const fn = mockFetch(200, { data: { profile: profileFixture } })

    await expect(fetchProfile()).resolves.toEqual(profileFixture)

    const [url, init] = fn.mock.calls[0]
    expect(url).toBe('/graphql')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body).query).toContain('profile')
  })

  it('при HTTP-ошибке бросает ApiError с кодом', async () => {
    mockFetch(500, {})
    await expect(fetchProfile()).rejects.toThrow('Сервер ответил ошибкой 500')
  })

  it('при ответе не в JSON бросает ApiError', async () => {
    mockFetch(200, null, '<html>')
    await expect(fetchProfile()).rejects.toThrow('Сервер вернул не JSON')
  })

  it('GraphQL отдаёт 200 с полем errors: берём текст ошибки оттуда', async () => {
    mockFetch(200, { errors: [{ message: 'Cannot query field' }, { message: 'Ещё одна' }] })
    await expect(fetchProfile()).rejects.toThrow('Cannot query field; Ещё одна')
  })

  it('если profile = null, говорит, что профиль не найден', async () => {
    mockFetch(200, { data: { profile: null } })
    await expect(fetchProfile()).rejects.toThrow('Профиль не найден')
  })

  it('при недоступной сети бросает ApiError с понятным текстом', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const error = await fetchProfile().catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Не удалось связаться с сервером')
  })

  it('отмену запроса пробрасывает как AbortError, а не ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('aborted', 'AbortError')))
    const error = await fetchProfile().catch((e) => e)
    expect(error).not.toBeInstanceOf(ApiError)
    expect(error.name).toBe('AbortError')
  })
})
