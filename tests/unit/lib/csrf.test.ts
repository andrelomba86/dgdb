import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ForbiddenError } from '@/lib/errors'

const mocks = vi.hoisted(() => ({
  headers: vi.fn(),
  get: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: mocks.headers,
}))

import { assertSameOriginRequest } from '@/lib/csrf'

describe('lib/csrf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.headers.mockResolvedValue({
      get: mocks.get,
    })
  })

  it('aceita requisicao com origin da mesma origem', async () => {
    mocks.get.mockImplementation((key: string) => {
      if (key === 'host') return 'app.local'
      if (key === 'origin') return 'https://app.local'
      return null
    })

    await expect(assertSameOriginRequest()).resolves.toBeUndefined()
  })

  it('aceita requisicao com referer da mesma origem', async () => {
    mocks.get.mockImplementation((key: string) => {
      if (key === 'host') return 'app.local'
      if (key === 'referer') return 'https://app.local/docentes'
      return null
    })

    await expect(assertSameOriginRequest()).resolves.toBeUndefined()
  })

  it('rejeita requisicao sem host', async () => {
    mocks.get.mockReturnValue(null)

    await expect(assertSameOriginRequest()).rejects.toThrow(ForbiddenError)
    await expect(assertSameOriginRequest()).rejects.toThrow('Requisição sem host válido.')
  })

  it('rejeita origem diferente do host da requisicao', async () => {
    mocks.get.mockImplementation((key: string) => {
      if (key === 'x-forwarded-host') return 'api.local'
      if (key === 'origin') return 'https://evil.local'
      return null
    })

    await expect(assertSameOriginRequest()).rejects.toThrow('Origem da requisição não autorizada.')
  })
})
