import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { StartedTestContainer } from 'testcontainers'

import { setupDbTestContext, shouldRunDbTests, teardownDbTestContext } from '../db-test-env'

const runDbTests = shouldRunDbTests

describe.skipIf(!runDbTests)('integration/repositories/auth-repository (mysql)', () => {
  let container: StartedTestContainer | undefined
  let databaseUrl: string

  beforeAll(async () => {
    const context = await setupDbTestContext()
    container = context.container
    databaseUrl = context.databaseUrl
  }, 120000)

  afterAll(async () => {
    await teardownDbTestContext({ container, databaseUrl })
  })

  it('persiste e valida sessao por token hash', async () => {
    const { prisma } = await import('@/lib/prisma')
    const { AuthRepository } = await import('@/repositories/auth-repository')
    const repository = new AuthRepository()

    await prisma.usuario.create({
      data: {
        login: 'admin-db',
        nome: 'Admin DB',
        senhaHash: 'hash-db',
        ativo: true,
      },
    })

    const user = await repository.findUserByLogin('admin-db')
    expect(user?.login).toBe('admin-db')

    const createdSession = await repository.createSession({
      tokenHash: 'token-hash-db',
      usuarioId: user!.id,
      expiraEm: new Date(Date.now() + 1000 * 60 * 30),
      metadata: {
        ip: '127.0.0.1',
        userAgent: 'vitest-db',
      },
    })

    expect(createdSession.usuario.id).toBe(user!.id)

    const validSession = await repository.findValidSessionByTokenHash('token-hash-db')
    expect(validSession?.usuario.login).toBe('admin-db')

    await repository.deleteSessionByTokenHash('token-hash-db')
    const deletedSession = await repository.findValidSessionByTokenHash('token-hash-db')
    expect(deletedSession).toBeNull()
  })
})
