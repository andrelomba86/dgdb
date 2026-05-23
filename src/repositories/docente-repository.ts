import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import type { DocenteAggregate, DocenteListResult } from '@/types/docente'
import type { DocenteListInput } from '@/validators/docente'

export const docenteInclude = Prisma.validator<Prisma.DocenteInclude>()({
  progressoes: true,
  telefones: true,
  documentos: true,
  contasBancarias: true,
})

export type DocenteWithIncludes = Prisma.DocenteGetPayload<{ include: typeof docenteInclude }>

/**
 * Ordena uma lista de progressoes pela dataInicio.
 * Progressoes sem dataInicio vão para o final.
 * direction = 'asc' | 'desc' (default 'desc' to preserve previous behaviour)
 */
function sortProgressoesList<T extends { dataInicio?: Date | string | null }>(
  list?: T[],
  direction: 'asc' | 'desc' = 'desc',
) {
  return (list ?? []).slice().sort((a, b) => {
    const ta = a?.dataInicio ? new Date(a.dataInicio).getTime() : Number.POSITIVE_INFINITY
    const tb = b?.dataInicio ? new Date(b.dataInicio).getTime() : Number.POSITIVE_INFINITY
    if (ta === tb) return 0
    if (direction === 'asc') return ta < tb ? -1 : 1
    return ta > tb ? -1 : 1
  })
}

function normalizeDocente(doc: DocenteWithIncludes, direction: 'asc' | 'desc' = 'desc') {
  // If the source object doesn't have a progressoes property (common in unit tests/mocks),
  // return it as-is to avoid adding extra fields. Otherwise normalize the list.
  if (!Object.prototype.hasOwnProperty.call(doc, 'progressoes')) return doc

  return {
    ...doc,
    progressoes: sortProgressoesList(doc.progressoes as any, direction),
  }
}

type DocenteListFilterQuery = Pick<DocenteListInput, 'nome' | 'ativo'>

function buildWhere(filters: DocenteListFilterQuery): Prisma.DocenteWhereInput {
  const and: Prisma.DocenteWhereInput[] = []
  if (filters.nome && filters.nome.trim().length > 0) {
    and.push({ nome: { contains: filters.nome.trim() } })
  }
  if (typeof filters.ativo === 'boolean') {
    and.push({ ativo: filters.ativo })
  }
  return and.length ? { AND: and } : {}
}

const ALLOWED_SORT_FIELDS = new Set([
  'id',
  'nome',
  'matricula',
  'email',
  'ativo',
  'createdAt',
  'updatedAt',
])

function sanitizeSortBy(field?: string) {
  const f = field ?? 'id'
  return ALLOWED_SORT_FIELDS.has(f) ? f : 'id'
}

type DocenteConflictParams = {
  matricula?: string | null
  email?: string | null
  ignoreId?: number
}

export type SuggestedOptions = {
  telefoneTipos: string[]
  documentoTipos: string[]
  progressaoFuncoes: string[]
  progressaoReferencias: string[]
}

export class DocenteRepository {
  async listSuggestedOptions(): Promise<SuggestedOptions> {
    const [documentoTiposRows, telefoneTiposRows, progressaoFuncoesRows, progressaoReferenciasRows] =
      await Promise.all([
        prisma.documento.findMany({
          select: { tipo: true },
          distinct: ['tipo'],
          orderBy: { tipo: 'asc' },
        }),
        prisma.telefone.findMany({
          select: { tipo: true },
          distinct: ['tipo'],
          orderBy: { tipo: 'asc' },
        }),
        prisma.progressao.findMany({
          where: { funcao: { not: null } },
          select: { funcao: true },
          distinct: ['funcao'],
          orderBy: { funcao: 'asc' },
        }),
        prisma.progressao.findMany({
          where: { referencia: { not: null } },
          select: { referencia: true },
          distinct: ['referencia'],
          orderBy: { referencia: 'asc' },
        }),
      ])

    return {
      documentoTipos: documentoTiposRows.map(row => row.tipo),
      telefoneTipos: telefoneTiposRows.map(row => row.tipo),
      progressaoFuncoes: progressaoFuncoesRows
        .map(row => row.funcao)
        .filter((v): v is string => typeof v === 'string' && v.trim().length > 0),
      progressaoReferencias: progressaoReferenciasRows
        .map(row => row.referencia)
        .filter((v): v is string => typeof v === 'string' && v.trim().length > 0),
    }
  }

  async list(filters: DocenteListInput): Promise<DocenteListResult> {
    const where = buildWhere(filters)

    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 10
    const sortBy = sanitizeSortBy(filters.sortBy as unknown as string)
    const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc'

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

    // Garantir ordem por dataInicio nas progressoes de cada item
    const normalizedItems = (items as DocenteWithIncludes[]).map(item => normalizeDocente(item, 'desc'))

    return {
      items: normalizedItems as unknown as DocenteAggregate[],
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
    const orderField = sanitizeSortBy(sortBy as unknown as string)
    const orderDirection = sortOrder === 'desc' ? 'desc' : 'asc'
    const items = await prisma.docente.findMany({
      include: docenteInclude,
      where: buildWhere(filters),
      orderBy: {
        [orderField]: orderDirection,
      },
    })

    // Garantir ordem por dataInicio nas progressoes de cada item
    const normalizedItems = (items as DocenteWithIncludes[]).map(item => normalizeDocente(item, 'desc'))

    return normalizedItems as unknown as DocenteAggregate[]
  }

  async findById(id: number): Promise<DocenteAggregate | null> {
    const docente = await prisma.docente.findUnique({
      where: { id },
      include: docenteInclude,
    })

    if (!docente) return null

    return normalizeDocente(docente as DocenteWithIncludes, 'desc') as unknown as DocenteAggregate | null
  }

  async findConflict(params: DocenteConflictParams) {
    if (!params.matricula && !params.email) return null
    const or = [
      ...(params.matricula ? [{ matricula: params.matricula }] : []),
      ...(params.email ? [{ email: params.email }] : []),
    ]

    return prisma.docente.findFirst({
      where: {
        OR: or,
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

    return normalizeDocente(docente as DocenteWithIncludes, 'desc') as unknown as DocenteAggregate
  }

  async update(id: number, data: Prisma.DocenteUpdateInput): Promise<DocenteAggregate> {
    const docente = await prisma.docente.update({
      where: { id },
      data,
      include: docenteInclude,
    })

    return normalizeDocente(docente as DocenteWithIncludes, 'desc') as unknown as DocenteAggregate
  }

  async delete(id: number): Promise<void> {
    await prisma.docente.delete({
      where: { id },
    })
  }
}

export const docenteRepository = new DocenteRepository()
