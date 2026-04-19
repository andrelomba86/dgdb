import bcrypt from 'bcrypt'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { StartedTestContainer } from 'testcontainers'

import { setupDbTestContext, shouldRunDbTests, teardownDbTestContext } from '../db-test-env'
import { UnauthorizedError } from '@/lib/errors'
import { AuthService } from '@/services/auth-service'

const runDbTests = shouldRunDbTests

describe.skipIf(!runDbTests)('integration/services/auth-service (mysql)', () => {
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

  it('realiza login, valida e encerra sessao', async () => {
    const { prisma } = await import('@/lib/prisma')
    const service = new AuthService()

    const senhaHash = await bcrypt.hash('segredo-123', 8)

    await prisma.usuario.create({
      data: {
        login: 'adminsvc',
        nome: 'Admin Service',
        senhaHash,
        ativo: true,
      },
    })

    const loginResult = await service.login(
      {
        login: '  ADMINSVC  ',
        senha: 'segredo-123',
      },
      {
        ip: '127.0.0.1',
        userAgent: 'vitest-db',
      },
    )

    expect(loginResult.session.usuario.login).toBe('adminsvc')

    const validSession = await service.validateSession(loginResult.token)
    expect(validSession?.usuario.login).toBe('adminsvc')

    await service.logout(loginResult.token)
    const invalidSession = await service.validateSession(loginResult.token)
    expect(invalidSession).toBeNull()

    await prisma.usuario.deleteMany()
  })

  it('rejeita credenciais invalidas e usuario inativo', async () => {
    const { prisma } = await import('@/lib/prisma')
    const service = new AuthService()

    const senhaHash = await bcrypt.hash('segredo-123', 8)

    await prisma.usuario.create({
      data: {
        login: 'inativo',
        nome: 'Usuario Inativo',
        senhaHash,
        ativo: false,
      },
    })

    await expect(
      service.login(
        {
          login: 'inexistente',
          senha: 'segredo-123',
        },
        {},
      ),
    ).rejects.toThrow(UnauthorizedError)

    await expect(
      service.login(
        {
          login: 'inativo',
          senha: 'segredo-123',
        },
        {},
      ),
    ).rejects.toThrow('Credenciais inválidas.')

    await prisma.usuario.deleteMany()
  })
})
