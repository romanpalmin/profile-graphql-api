import type { Profile } from './types'

// Один запрос за всем профилем: вложенные списки сервер собирает сам (DataLoader убирает N+1).
export const PROFILE_QUERY = `
  query Profile {
    profile {
      id slug name title description location
      links { id label url }
      skills { id name category level note }
      experience {
        id company position startDate endDate
        achievements { id text }
      }
      projects { id name url description technologies }
    }
  }
`

/** Ошибка обращения к API с понятным пользователю текстом. */
export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

interface GraphQLResponse {
  data?: { profile?: Profile | null }
  errors?: { message: string }[]
}

// Относительный путь: фронт и API на одном домене, CORS не нужен.
export async function fetchProfile(signal?: AbortSignal): Promise<Profile> {
  let response: Response
  try {
    response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: PROFILE_QUERY }),
      signal,
    })
  } catch (error) {
    // Отмена запроса (AbortSignal) пробрасываем как есть: это не ошибка для пользователя.
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError('Не удалось связаться с сервером')
  }

  if (!response.ok) {
    throw new ApiError(`Сервер ответил ошибкой ${response.status}`)
  }

  let body: GraphQLResponse
  try {
    body = (await response.json()) as GraphQLResponse
  } catch {
    throw new ApiError('Сервер вернул не JSON')
  }

  // GraphQL отдаёт HTTP 200 даже при ошибке запроса: причина лежит в поле errors.
  if (body.errors?.length) {
    throw new ApiError(body.errors.map((e) => e.message).join('; '))
  }
  if (!body.data?.profile) {
    throw new ApiError('Профиль не найден')
  }
  return body.data.profile
}
