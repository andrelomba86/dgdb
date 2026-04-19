import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    usuario: {
      findUnique: vi.fn(),
    },
    sessao: {
      create: vi.fn(),
      findFirst: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

import { AuthRepository } from '@/repositories/auth-repository'

describe('repositories/auth-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('busca usuario por login', async () => {
    const repository = new AuthRepository()

    prismaMock.usuario.findUnique.mockResolvedValue({ id: 1, login: 'admin' })

    await expect(repository.findUserByLogin('admin')).resolves.toEqual({ id: 1, login: 'admin' })
    expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({ where: { login: 'admin' } })
  })

  it('cria sessao com metadata e include do usuario', async () => {
    const repository = new AuthRepository()
    const expiraEm = new Date('2026-12-01T00:00:00.000Z')

    prismaMock.sessao.create.mockResolvedValue({
      id: 1,
      tokenHash: 'hashed',
      expiraEm,
      ipOrigem: '127.0.0.1',
      userAgent: 'vitest',
      criadoEm: new Date('2026-01-01T00:00:00.000Z'),
      usuarioId: 10,
      usuario: { id: 10, login: 'admin', nome: 'Admin', ativo: true },
    })

    const session = await repository.createSession({
      tokenHash: 'hashed',
      usuarioId: 10,
      expiraEm,
      metadata: { ip: '127.0.0.1', userAgent: 'vitest' },
    })

    expect(prismaMock.sessao.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          tokenHash: 'hashed',
          usuarioId: 10,
          expiraEm,
          ipOrigem: '127.0.0.1',
          userAgent: 'vitest',
        },
      }),
    )
    expect(session.usuario.login).toBe('admin')

    prismaMock.sessao.create.mockResolvedValueOnce({
      id: 2,
      tokenHash: 'hashed-2',
      expiraEm,
      ipOrigem: null,
      userAgent: null,
      criadoEm: new Date('2026-01-01T00:00:00.000Z'),
      usuarioId: 11,
      usuario: { id: 11, login: 'guest', nome: 'Guest', ativo: true },
    })

    await repository.createSession({
      tokenHash: 'hashed-2',
      usuarioId: 11,
      expiraEm,
      metadata: {},
    })

    expect(prismaMock.sessao.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ipOrigem: null,
          userAgent: null,
        }),
      }),
    )
  })

  it('busca sessao valida por token hash e remove sessoes', async () => {
    const repository = new AuthRepository()

    prismaMock.sessao.findFirst.mockResolvedValue({ id: 2 })

    await expect(repository.findValidSessionByTokenHash('hash')).resolves.toEqual({ id: 2 })
    expect(prismaMock.sessao.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tokenHash: 'hash',
          usuario: { ativo: true },
        }),
      }),
    )

    await repository.deleteSessionByTokenHash('hash')
    expect(prismaMock.sessao.deleteMany).toHaveBeenCalledWith({ where: { tokenHash: 'hash' } })

    await repository.deleteExpiredSessions()
    expect(prismaMock.sessao.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          expiraEm: expect.objectContaining({ lte: expect.any(Date) }),
        },
      }),
    )
  })
})
