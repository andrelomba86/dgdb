import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UnauthorizedError } from '@/lib/errors'
import { AuthService } from '@/services/auth-service'
import type { AuthenticatedSession, SessionRequestMetadata } from '@/types/auth'
import type { LoginInput } from '@/validators/auth'

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}))

vi.mock('@/lib/session', () => ({
  createSessionToken: vi.fn(),
  getSessionExpirationDate: vi.fn(),
  hashSessionToken: vi.fn(),
}))

import bcrypt from 'bcrypt'
import { createSessionToken, getSessionExpirationDate, hashSessionToken } from '@/lib/session'

const createSession = (): AuthenticatedSession => ({
  id: 1,
  tokenHash: 'token-hash',
  expiraEm: new Date('2026-12-01T00:00:00.000Z'),
  ipOrigem: '127.0.0.1',
  userAgent: 'vitest',
  criadoEm: new Date('2026-04-18T00:00:00.000Z'),
  usuarioId: 10,
  usuario: {
    id: 10,
    login: 'admin',
    nome: 'Administrador',
    ativo: true,
  },
})

const createMocks = () => {
  const repository = {
    findUserByLogin: vi.fn(),
    createSession: vi.fn(),
    findValidSessionByTokenHash: vi.fn(),
    deleteSessionByTokenHash: vi.fn(),
    deleteExpiredSessions: vi.fn(),
  }

  const service = new AuthService(repository as never)
  return { repository, service }
}

describe('services/auth-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('faz login com sucesso e cria sessao', async () => {
    const { repository, service } = createMocks()
    const loginInput: LoginInput = { login: '  ADMIN  ', senha: 'segredo-123' }
    const metadata: SessionRequestMetadata = { ip: '10.0.0.1', userAgent: 'test-agent' }
    const expiresAt = new Date('2027-01-01T00:00:00.000Z')
    const persistedSession = createSession()

    repository.findUserByLogin.mockResolvedValue({
      id: 10,
      login: 'admin',
      nome: 'Administrador',
      ativo: true,
      senhaHash: 'persisted-hash',
    })
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(createSessionToken).mockReturnValue('raw-token')
    vi.mocked(hashSessionToken).mockReturnValue('hashed-token')
    vi.mocked(getSessionExpirationDate).mockReturnValue(expiresAt)
    repository.createSession.mockResolvedValue(persistedSession)

    const result = await service.login(loginInput, metadata)

    expect(repository.findUserByLogin).toHaveBeenCalledWith('admin')
    expect(bcrypt.compare).toHaveBeenCalledWith('segredo-123', 'persisted-hash')
    expect(hashSessionToken).toHaveBeenCalledWith('raw-token')
    expect(repository.createSession).toHaveBeenCalledWith({
      tokenHash: 'hashed-token',
      usuarioId: 10,
      expiraEm: expiresAt,
      metadata,
    })
    expect(result).toEqual({ token: 'raw-token', session: persistedSession })
  })

  it('rejeita login quando usuario nao existe ou esta inativo', async () => {
    const { repository, service } = createMocks()

    repository.findUserByLogin.mockResolvedValue(null)

    await expect(service.login({ login: 'admin', senha: '12345678' }, {})).rejects.toThrow(UnauthorizedError)

    repository.findUserByLogin.mockResolvedValue({
      id: 10,
      login: 'admin',
      nome: 'Administrador',
      ativo: false,
      senhaHash: 'persisted-hash',
    })

    await expect(service.login({ login: 'admin', senha: '12345678' }, {})).rejects.toThrow(
      'Credenciais inválidas.',
    )
    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it('rejeita login com senha invalida', async () => {
    const { repository, service } = createMocks()

    repository.findUserByLogin.mockResolvedValue({
      id: 10,
      login: 'admin',
      nome: 'Administrador',
      ativo: true,
      senhaHash: 'persisted-hash',
    })
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(service.login({ login: 'admin', senha: 'senha-invalida' }, {})).rejects.toThrow(
      UnauthorizedError,
    )
    expect(repository.createSession).not.toHaveBeenCalled()
  })

  it('valida sessao, logout e limpeza de expiradas usando hash do token', async () => {
    const { repository, service } = createMocks()
    const session = createSession()

    vi.mocked(hashSessionToken).mockReturnValue('hashed-token')
    repository.findValidSessionByTokenHash.mockResolvedValue(session)

    await expect(service.validateSession('raw-token')).resolves.toEqual(session)
    expect(repository.findValidSessionByTokenHash).toHaveBeenCalledWith('hashed-token')

    await service.logout('raw-token')
    expect(repository.deleteSessionByTokenHash).toHaveBeenCalledWith('hashed-token')

    await service.cleanupExpiredSessions()
    expect(repository.deleteExpiredSessions).toHaveBeenCalledOnce()
  })
})
