import { afterEach, describe, expect, it, vi } from 'vitest'

const { prismaClientMock } = vi.hoisted(() => ({
  prismaClientMock: vi.fn(function PrismaClientMock() {
    return { instance: 'default' }
  }),
}))

vi.mock('@prisma/client', () => ({
  PrismaClient: prismaClientMock,
}))

describe('lib/prisma', () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    delete (globalThis as { prisma?: unknown }).prisma
  })

  it('inicializa PrismaClient e salva global fora de producao', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    prismaClientMock.mockImplementation(function PrismaClientDevMock() {
      return { instance: 'dev' }
    })

    const module = await import('@/lib/prisma')

    expect(prismaClientMock).toHaveBeenCalledWith({ log: ['warn', 'error'] })
    expect(module.prisma).toEqual({ instance: 'dev' })
    expect((globalThis as { prisma?: unknown }).prisma).toEqual({ instance: 'dev' })
  })

  it('nao sobrescreve global em producao', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    prismaClientMock.mockImplementation(function PrismaClientProdMock() {
      return { instance: 'prod' }
    })

    const module = await import('@/lib/prisma')

    expect(prismaClientMock).toHaveBeenCalledWith({ log: ['error'] })
    expect(module.prisma).toEqual({ instance: 'prod' })
    expect((globalThis as { prisma?: unknown }).prisma).toBeUndefined()
  })
})
