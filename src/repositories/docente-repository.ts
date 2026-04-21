import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import type { DocenteAggregate, DocenteListResult } from '@/types/docente'
import type { DocenteListInput } from '@/validators/docente'

const docenteInclude = {
  progressoes: true,
  telefones: true,
  documentos: true,
  contasBancarias: true,
} satisfies Prisma.DocenteInclude

type DocenteListFilterQuery = Pick<DocenteListInput, 'nome' | 'ativo'>

function buildWhere(filters: DocenteListFilterQuery): Prisma.DocenteWhereInput {
  return {
    AND: [
      filters.nome ? { nome: { contains: filters.nome } } : {},
      typeof filters.ativo === 'boolean' ? { ativo: filters.ativo } : {},
    ],
  }
}

type DocenteConflictParams = {
  matricula?: string | null
  email?: string | null
  ignoreId?: number
}

export class DocenteRepository {
  async list(filters: DocenteListInput): Promise<DocenteListResult> {
    const where = buildWhere(filters)

    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 10
    const sortBy = (filters.sortBy ?? 'id') as string
    const sortOrder = filters.sortOrder ?? 'asc'

    const skip = (page - 1) * pageSize

    const [items, total] = await prisma.$transaction([
      prisma.docente.findMany({
        include: docenteInclude,
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: pageSize,
      }),
      prisma.docente.count({ where }),
    ])

    return {
      items: items as DocenteAggregate[],
      total,
      page,
      pageSize,
    }
  }

  async listAll(
    filters: DocenteListFilterQuery,
    sortBy: DocenteListInput['sortBy'],
    sortOrder: DocenteListInput['sortOrder'],
  ): Promise<DocenteAggregate[]> {
    const orderField = (sortBy ?? 'id') as string
    const orderDirection = sortOrder ?? 'asc'
    const items = await prisma.docente.findMany({
      include: docenteInclude,
      where: buildWhere(filters),
      orderBy: {
        [orderField]: orderDirection,
      },
    })

    return items as DocenteAggregate[]
  }

  async findById(id: number): Promise<DocenteAggregate | null> {
    const docente = await prisma.docente.findUnique({
      where: { id },
      include: docenteInclude,
    })

    return docente as DocenteAggregate | null
  }

  async findConflict(params: DocenteConflictParams) {
    return prisma.docente.findFirst({
      where: {
        OR: [
          { ...(params.matricula ? { matricula: params.matricula } : {}) },
          { ...(params.email ? { email: params.email } : {}) },
        ],
        id: params.ignoreId ? { not: params.ignoreId } : undefined,
      },
      select: {
        id: true,
        matricula: true,
        email: true,
      },
    })
  }

  async create(data: Prisma.DocenteCreateInput): Promise<DocenteAggregate> {
    const docente = await prisma.docente.create({
      data,
      include: docenteInclude,
    })

    return docente as DocenteAggregate
  }

  async update(id: number, data: Prisma.DocenteUpdateInput): Promise<DocenteAggregate> {
    const docente = await prisma.docente.update({
      where: { id },
      data,
      include: docenteInclude,
    })

    return docente as DocenteAggregate
  }

  async delete(id: number): Promise<void> {
    await prisma.docente.delete({
      where: { id },
    })
  }
}

export const docenteRepository = new DocenteRepository()
