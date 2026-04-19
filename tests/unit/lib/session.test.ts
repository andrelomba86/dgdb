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
    vi.unstubAllEnvs()

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

  it('define cookie seguro em producao', async () => {
    const expiresAt = new Date('2027-01-01T00:00:00.000Z')
    vi.stubEnv('NODE_ENV', 'production')

    await setSessionCookie('token-prod', expiresAt)

    expect(mocks.cookieSet).toHaveBeenCalledWith(SESSION_COOKIE_NAME, 'token-prod', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    })
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

  it('retorna null para token ausente e headers ausentes', async () => {
    mocks.cookieGet.mockReturnValue(undefined)
    mocks.headerGet.mockReturnValue(null)

    await expect(getSessionTokenFromCookie()).resolves.toBeNull()
    await expect(readRequestMetadata()).resolves.toEqual({
      ip: null,
      userAgent: null,
    })
  })

  it('trunca user-agent para 255 caracteres', async () => {
    const longUserAgent = 'a'.repeat(400)
    mocks.headerGet.mockImplementation((key: string) => {
      if (key === 'x-forwarded-for') return '127.0.0.1'
      if (key === 'user-agent') return longUserAgent
      return null
    })

    await expect(readRequestMetadata()).resolves.toEqual({
      ip: '127.0.0.1',
      userAgent: 'a'.repeat(255),
    })
  })
})
