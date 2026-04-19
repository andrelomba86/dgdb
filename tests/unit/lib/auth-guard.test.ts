import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getSessionTokenFromCookie: vi.fn(),
  validateSession: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

vi.mock('@/lib/session', () => ({
  getSessionTokenFromCookie: mocks.getSessionTokenFromCookie,
  clearSessionCookie: vi.fn(),
}))

vi.mock('@/services/auth-service', () => ({
  authService: {
    validateSession: mocks.validateSession,
  },
}))

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}))

import { getAuthenticatedUser, requireAuthenticatedUser } from '@/lib/auth-guard'

describe('lib/auth-guard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna null quando nao existe token de sessao', async () => {
    mocks.getSessionTokenFromCookie.mockResolvedValue(null)

    await expect(getAuthenticatedUser()).resolves.toBeNull()
    expect(mocks.validateSession).not.toHaveBeenCalled()
  })

  it('retorna null quando sessao nao e valida', async () => {
    mocks.getSessionTokenFromCookie.mockResolvedValue('token-1')
    mocks.validateSession.mockResolvedValue(null)

    await expect(getAuthenticatedUser()).resolves.toBeNull()
  })

  it('retorna usuario autenticado quando sessao e valida', async () => {
    const usuario = { id: 1, login: 'admin', nome: 'Admin', ativo: true }
    mocks.getSessionTokenFromCookie.mockResolvedValue('token-1')
    mocks.validateSession.mockResolvedValue({ usuario })

    await expect(getAuthenticatedUser()).resolves.toEqual(usuario)
  })

  it('redireciona para login quando autenticacao e obrigatoria', async () => {
    mocks.getSessionTokenFromCookie.mockResolvedValue(null)

    await expect(requireAuthenticatedUser()).rejects.toThrow('NEXT_REDIRECT:/login')
    expect(mocks.redirect).toHaveBeenCalledWith('/login')
  })
})
