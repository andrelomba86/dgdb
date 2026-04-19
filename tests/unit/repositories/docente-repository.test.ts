import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(),
    docente: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

import { DocenteRepository } from '@/repositories/docente-repository'

describe('repositories/docente-repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista docentes com paginacao e ordenacao', async () => {
    const repository = new DocenteRepository()
    const docente = { id: 1, nome: 'Ana' }

    prismaMock.$transaction.mockResolvedValue([[docente], 1])

    const result = await repository.list({
      page: 2,
      pageSize: 5,
      nome: 'Ana',
      ativo: true,
      sortBy: 'nome',
      sortOrder: 'desc',
    })

    expect(prismaMock.$transaction).toHaveBeenCalledOnce()
    expect(result).toEqual({
      items: [docente],
      total: 1,
      page: 2,
      pageSize: 5,
    })

    prismaMock.$transaction.mockResolvedValue([[], 0])
    await repository.list({
      page: 1,
      pageSize: 10,
      nome: undefined,
      ativo: undefined,
      sortBy: 'nome',
      sortOrder: 'asc',
    })
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(2)
  })

  it('lista todos para exportacao com filtros e ordenacao padrao', async () => {
    const repository = new DocenteRepository()

    prismaMock.docente.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }])

    await expect(repository.listAll({ nome: 'Ana', ativo: false }, undefined, undefined)).resolves.toEqual([
      { id: 1 },
      { id: 2 },
    ])

    expect(prismaMock.docente.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { id: 'asc' },
      }),
    )
  })

  it('busca por id, conflito, cria, atualiza e remove', async () => {
    const repository = new DocenteRepository()

    prismaMock.docente.findUnique.mockResolvedValue({ id: 10 })
    await expect(repository.findById(10)).resolves.toEqual({ id: 10 })

    prismaMock.docente.findFirst.mockResolvedValue({ id: 11, matricula: 'ABC', email: null })
    await expect(repository.findConflict({ matricula: 'ABC', ignoreId: 9 })).resolves.toEqual({
      id: 11,
      matricula: 'ABC',
      email: null,
    })

    expect(prismaMock.docente.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: 9 },
        }),
      }),
    )

    prismaMock.docente.findFirst.mockResolvedValue({ id: 12, matricula: null, email: 'a@b.com' })
    await expect(repository.findConflict({ email: 'a@b.com' })).resolves.toEqual({
      id: 12,
      matricula: null,
      email: 'a@b.com',
    })
    expect(prismaMock.docente.findFirst).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: undefined,
        }),
      }),
    )

    prismaMock.docente.create.mockResolvedValue({ id: 20 })
    await expect(repository.create({ nome: 'Ana' } as never)).resolves.toEqual({ id: 20 })

    prismaMock.docente.update.mockResolvedValue({ id: 20, nome: 'Atualizada' })
    await expect(repository.update(20, { nome: 'Atualizada' } as never)).resolves.toEqual({
      id: 20,
      nome: 'Atualizada',
    })

    prismaMock.docente.delete.mockResolvedValue(undefined)
    await expect(repository.delete(20)).resolves.toBeUndefined()
    expect(prismaMock.docente.delete).toHaveBeenCalledWith({ where: { id: 20 } })
  })
})
