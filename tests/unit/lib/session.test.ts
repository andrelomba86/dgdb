import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  headers: vi.fn(),
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
  cookieDelete: vi.fn(),
  headerGet: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: mocks.cookies,
  headers: mocks.headers,
}))

import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  createSessionToken,
  getSessionExpirationDate,
  getSessionTokenFromCookie,
  hashSessionToken,
  readRequestMetadata,
  setSessionCookie,
} from '@/lib/session'

describe('lib/session', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.cookies.mockResolvedValue({
      get: mocks.cookieGet,
      set: mocks.cookieSet,
      delete: mocks.cookieDelete,
    })

    mocks.headers.mockResolvedValue({
      get: mocks.headerGet,
    })
  })

  it('gera token aleatorio e hash deterministico', () => {
    const token = createSessionToken()
    const hashA = hashSessionToken(token)
    const hashB = hashSessionToken(token)

    expect(token).toMatch(/^[a-f0-9]{64}$/)
    expect(hashA).toBe(hashB)
    expect(hashA).toMatch(/^[a-f0-9]{64}$/)
  })

  it('retorna data de expiracao futura dentro do ttl', () => {
    const expiresAt = getSessionExpirationDate().getTime()
    expect(expiresAt).toBeGreaterThan(Date.now())
  })

  it('define e limpa cookie de sessao', async () => {
    const expiresAt = new Date('2027-01-01T00:00:00.000Z')
    vi.stubEnv('NODE_ENV', 'test')

    await setSessionCookie('token-123', expiresAt)
    expect(mocks.cookieSet).toHaveBeenCalledWith(SESSION_COOKIE_NAME, 'token-123', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    })

    await clearSessionCookie()
    expect(mocks.cookieDelete).toHaveBeenCalledWith(SESSION_COOKIE_NAME)
  })

  it('le token do cookie e le metadata da requisicao', async () => {
    mocks.cookieGet.mockReturnValue({ value: 'raw-token' })
    mocks.headerGet.mockImplementation((key: string) => {
      if (key === 'x-forwarded-for') return '10.0.0.1, 10.0.0.2'
      if (key === 'user-agent') return 'agent-example'
      return null
    })

    await expect(getSessionTokenFromCookie()).resolves.toBe('raw-token')
    await expect(readRequestMetadata()).resolves.toEqual({
      ip: '10.0.0.1',
      userAgent: 'agent-example',
    })
  })
})
