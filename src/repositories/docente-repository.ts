import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import type { DocenteAggregate, DocenteListResult } from '@/types/docente'
import type { DocenteListInput } from '@/validators/docente'

const docenteInclude = {
  cargos: true,
  telefones: true,
  documentos: true,
  contasBancarias: true,
} satisfies Prisma.DocenteInclude

type DocenteListFilterQuery = Pick<
  DocenteListInput,
  'nome' | 'matricula' | 'email' | 'dataAdmissaoInicio' | 'dataAdmissaoFim'
>

function buildWhere(filters: DocenteListFilterQuery): Prisma.DocenteWhereInput {
  return {
    AND: [
      filters.nome ? { nome: { contains: filters.nome } } : {},
      filters.matricula ? { matricula: { contains: filters.matricula } } : {},
      filters.email ? { email: { contains: filters.email } } : {},
      filters.dataAdmissaoInicio || filters.dataAdmissaoFim
        ? {
            dataAdmissao: {
              gte: filters.dataAdmissaoInicio ?? undefined,
              lte: filters.dataAdmissaoFim ?? undefined,
            },
          }
        : {},
    ],
  }
}

type DocenteConflictParams = {
  matricula: string
  email: string
  excludeId?: number
}

export class DocenteRepository {
  async list(filters: DocenteListInput): Promise<DocenteListResult> {
    const where = buildWhere(filters)

    const skip = (filters.page - 1) * filters.pageSize

    const [items, total] = await prisma.$transaction([
      prisma.docente.findMany({
        include: docenteInclude,
        where,
        orderBy: {
          [filters.sortBy]: filters.sortOrder,
        },
        skip,
        take: filters.pageSize,
      }),
      prisma.docente.count({ where }),
    ])

    return {
      items: items as DocenteAggregate[],
      total,
      page: filters.page,
      pageSize: filters.pageSize,
    }
  }

  async listAll(
    filters: DocenteListFilterQuery,
    sortBy: DocenteListInput['sortBy'],
    sortOrder: DocenteListInput['sortOrder'],
  ): Promise<DocenteAggregate[]> {
    const items = await prisma.docente.findMany({
      include: docenteInclude,
      where: buildWhere(filters),
      orderBy: {
        [sortBy]: sortOrder,
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
        OR: [{ matricula: params.matricula }, { email: params.email }],
        id: params.excludeId ? { not: params.excludeId } : undefined,
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
