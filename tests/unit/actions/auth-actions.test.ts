import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ForbiddenError, UnauthorizedError } from '@/lib/errors'

const mocks = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  assertSameOriginRequest: vi.fn(),
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  getSessionTokenFromCookie: vi.fn(),
  readRequestMetadata: vi.fn(),
  authLogin: vi.fn(),
  authLogout: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}))

vi.mock('@/lib/csrf', () => ({
  assertSameOriginRequest: mocks.assertSameOriginRequest,
}))

vi.mock('@/lib/session', () => ({
  setSessionCookie: mocks.setSessionCookie,
  clearSessionCookie: mocks.clearSessionCookie,
  getSessionTokenFromCookie: mocks.getSessionTokenFromCookie,
  readRequestMetadata: mocks.readRequestMetadata,
}))

vi.mock('@/services/auth-service', () => ({
  authService: {
    login: mocks.authLogin,
    logout: mocks.authLogout,
  },
}))

import { loginAction, logoutAction } from '@/actions/auth-actions'

const makeLoginForm = (login: string, senha: string) => {
  const formData = new FormData()
  formData.set('login', login)
  formData.set('senha', senha)
  return formData
}

describe('actions/auth-actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.assertSameOriginRequest.mockResolvedValue(undefined)
    mocks.readRequestMetadata.mockResolvedValue({ ip: '10.0.0.1', userAgent: 'vitest' })
  })

  it('realiza login com sucesso e redireciona para a raiz', async () => {
    const expiraEm = new Date('2027-01-01T00:00:00.000Z')
    mocks.authLogin.mockResolvedValue({
      token: 'token-abc',
      session: { expiraEm },
    })

    await expect(loginAction(makeLoginForm('admin', 'senha1234'))).rejects.toThrow('NEXT_REDIRECT:/')

    expect(mocks.authLogin).toHaveBeenCalledWith(
      { login: 'admin', senha: 'senha1234' },
      { ip: '10.0.0.1', userAgent: 'vitest' },
    )
    expect(mocks.setSessionCookie).toHaveBeenCalledWith('token-abc', expiraEm)
  })

  it('redireciona para erro de credenciais quando formdata e invalido', async () => {
    await expect(loginAction(makeLoginForm(' ', '123'))).rejects.toThrow(
      'NEXT_REDIRECT:/login?erro=Credenciais%20inv%C3%A1lidas',
    )

    expect(mocks.authLogin).not.toHaveBeenCalled()
  })

  it('redireciona para erro de origem invalida quando csrf bloqueia', async () => {
    mocks.assertSameOriginRequest.mockRejectedValue(new ForbiddenError('forbidden'))

    await expect(loginAction(makeLoginForm('admin', 'senha1234'))).rejects.toThrow(
      'NEXT_REDIRECT:/login?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida',
    )
  })

  it('redireciona para erro de credenciais quando auth service retorna unauthorized', async () => {
    mocks.authLogin.mockRejectedValue(new UnauthorizedError('Credenciais inválidas.'))

    await expect(loginAction(makeLoginForm('admin', 'senha1234'))).rejects.toThrow(
      'NEXT_REDIRECT:/login?erro=Credenciais%20inv%C3%A1lidas',
    )
  })

  it('faz logout limpando sessao e redireciona para login', async () => {
    mocks.getSessionTokenFromCookie.mockResolvedValue('token-atual')
    mocks.authLogout.mockResolvedValue(undefined)

    await expect(logoutAction()).rejects.toThrow('NEXT_REDIRECT:/login')

    expect(mocks.authLogout).toHaveBeenCalledWith('token-atual')
    expect(mocks.clearSessionCookie).toHaveBeenCalledOnce()
  })

  it('logout redireciona com erro quando csrf bloqueia requisicao', async () => {
    mocks.assertSameOriginRequest.mockRejectedValue(new ForbiddenError('forbidden'))

    await expect(logoutAction()).rejects.toThrow(
      'NEXT_REDIRECT:/login?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida',
    )
  })
})
