'use server'

import { Buffer } from 'node:buffer'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { requireAuthenticatedUser } from '@/lib/auth-guard'
import { assertSameOriginRequest } from '@/lib/csrf'
import {
  buildDocentesCsvExport,
  buildDocentesPdfExport,
  type DocenteExportPayload,
} from '@/lib/docente-export'
import { ConflictError, ForbiddenError, NotFoundError } from '@/lib/errors'
import { docenteService } from '@/services/docente-service'
import { cargoInputSchema } from '@/validators/cargo'
import { contaBancariaInputSchema } from '@/validators/conta-bancaria'
import { documentoInputSchema } from '@/validators/documento'
import type { DocenteAggregate, DocenteListResult } from '@/types/docente'
import { telefoneInputSchema } from '@/validators/telefone'
import type { DocenteListInput } from '@/validators/docente'
import {
  createDocenteSchema,
  docenteIdSchema,
  docenteListSchema,
  updateDocenteSchema,
} from '@/validators/docente'

type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

async function ensureAuthenticated() {
  await requireAuthenticatedUser()
}

function formatZodIssues(error: z.ZodError) {
  return error.issues
    .map(issue => `${issue.path.length > 0 ? issue.path.join('.') : 'form'}: ${issue.message}`)
    .join('; ')
}

const toTrimmedString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

function isEmptyCargoRow(value: unknown) {
  const row = value as { descricao?: unknown; funcao?: unknown; dataInicio?: unknown; referencia?: unknown }
  return (
    toTrimmedString(row.descricao) === '' &&
    toTrimmedString(row.funcao) === '' &&
    toTrimmedString(row.dataInicio) === '' &&
    toTrimmedString(row.referencia) === ''
  )
}

function isEmptyTelefoneRow(value: unknown) {
  const row = value as { telefone?: unknown; tipo?: unknown }
  return toTrimmedString(row.telefone) === '' && toTrimmedString(row.tipo) === ''
}

function isEmptyDocumentoRow(value: unknown) {
  const row = value as { tipo?: unknown; documento?: unknown }
  return toTrimmedString(row.tipo) === '' && toTrimmedString(row.documento) === ''
}

function isEmptyContaRow(value: unknown) {
  const row = value as { banco?: unknown; agencia?: unknown; conta?: unknown }
  return (
    toTrimmedString(row.banco) === '' &&
    toTrimmedString(row.agencia) === '' &&
    toTrimmedString(row.conta) === ''
  )
}

function parseJsonArrayField<T>(
  formData: FormData,
  fieldName: string,
  schema: z.ZodSchema<T>,
  label: string,
  isEmptyRow?: (value: unknown) => boolean,
) {
  const rawValue = formData.get(fieldName)

  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    return {
      success: true as const,
      data: [] as T[],
    }
  }

  try {
    const parsedJson = JSON.parse(rawValue) as unknown

    const compactRows = Array.isArray(parsedJson)
      ? parsedJson.filter(value => !(isEmptyRow?.(value) ?? false))
      : parsedJson

    const parsed = z.array(schema).safeParse(compactRows)

    if (!parsed.success) {
      return {
        success: false as const,
        error: `${label}: ${formatZodIssues(parsed.error)}`,
      }
    }

    return {
      success: true as const,
      data: parsed.data,
    }
  } catch {
    return {
      success: false as const,
      error: `${label}: payload inválido.`,
    }
  }
}

function parseRelatedCollections(formData: FormData) {
  const cargos = parseJsonArrayField(formData, 'cargosData', cargoInputSchema, 'Cargos', isEmptyCargoRow)
  if (!cargos.success) {
    return cargos
  }

  const telefones = parseJsonArrayField(
    formData,
    'telefonesData',
    telefoneInputSchema,
    'Telefones',
    isEmptyTelefoneRow,
  )
  if (!telefones.success) {
    return telefones
  }

  const documentos = parseJsonArrayField(
    formData,
    'documentosData',
    documentoInputSchema,
    'Documentos',
    isEmptyDocumentoRow,
  )
  if (!documentos.success) {
    return documentos
  }

  const contasBancarias = parseJsonArrayField(
    formData,
    'contasBancariasData',
    contaBancariaInputSchema,
    'Contas bancárias',
    isEmptyContaRow,
  )
  if (!contasBancarias.success) {
    return contasBancarias
  }

  return {
    success: true as const,
    data: {
      cargos: cargos.data,
      telefones: telefones.data,
      documentos: documentos.data,
      contasBancarias: contasBancarias.data,
    },
  }
}

function parseListFilters(filters: Partial<DocenteListInput>) {
  // Remove campos inválidos (matricula, email) se existirem
  const { nome, ativo, sortBy, sortOrder, page, pageSize } = filters
  return docenteListSchema.safeParse({
    page: page ?? 1,
    pageSize: pageSize ?? 10,
    nome,
    ativo,
    sortBy,
    sortOrder,
  })
}

export async function listDocentesAction(
  filters: Partial<DocenteListInput> = {},
): Promise<ActionResult<DocenteListResult>> {
  try {
    await ensureAuthenticated()
    const parsed = parseListFilters(filters)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Filtros inválidos para listagem de docentes.',
      }
    }

    const result = await docenteService.list(parsed.data)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Erro ao listar docentes:', error)
    return {
      success: false,
      error: 'Erro ao listar docentes.',
    }
  }
}

export async function exportDocentesCsvAction(
  filters: Partial<DocenteListInput> = {},
): Promise<ActionResult<DocenteExportPayload>> {
  try {
    await ensureAuthenticated()
    await assertSameOriginRequest()

    const parsed = parseListFilters({
      ...filters,
      page: 1,
      pageSize: 10,
    })

    if (!parsed.success) {
      return {
        success: false,
        error: 'Filtros inválidos para exportação CSV.',
      }
    }

    const docentes = await docenteService.listAllForExport(parsed.data)

    return {
      success: true,
      data: buildDocentesCsvExport(docentes),
    }
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return {
        success: false,
        error: 'Origem da requisição inválida para exportação.',
      }
    }

    console.error('Erro ao exportar docentes em CSV:', error)
    return {
      success: false,
      error: 'Erro ao exportar docentes em CSV.',
    }
  }
}

export async function exportDocentesPdfAction(
  filters: Partial<DocenteListInput> = {},
): Promise<ActionResult<DocenteExportPayload>> {
  try {
    await ensureAuthenticated()
    await assertSameOriginRequest()

    const parsed = parseListFilters({
      ...filters,
      page: 1,
      pageSize: 10,
    })

    if (!parsed.success) {
      return {
        success: false,
        error: 'Filtros inválidos para exportação PDF.',
      }
    }

    const docentes = await docenteService.listAllForExport(parsed.data)

    return {
      success: true,
      data: await buildDocentesPdfExport(docentes),
    }
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return {
        success: false,
        error: 'Origem da requisição inválida para exportação.',
      }
    }

    console.error('Erro ao exportar docentes em PDF:', error)
    return {
      success: false,
      error: 'Erro ao exportar docentes em PDF.',
    }
  }
}

export async function getDocenteAction(id: number): Promise<ActionResult<DocenteAggregate>> {
  try {
    await ensureAuthenticated()

    const idParsed = docenteIdSchema.parse({ id })
    const docente = await docenteService.getById(idParsed.id)

    return {
      success: true,
      data: docente,
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        success: false,
        error: error.message,
      }
    }

    console.error('Erro ao buscar docente:', error)
    return {
      success: false,
      error: 'Erro ao buscar docente.',
    }
  }
}

export async function createDocenteAction(formData: FormData): Promise<void> {
  await ensureAuthenticated()
  await assertSameOriginRequest()

  const relationsResult = parseRelatedCollections(formData)
  if (!relationsResult.success) {
    return redirect(`/docentes/novo?erro=${encodeURIComponent(relationsResult.error)}`)
  }

  const parsed = createDocenteSchema.safeParse({
    nome: formData.get('nome'),
    endereco: formData.get('endereco') || null,
    dataNascimento: formData.get('dataNascimento')
      ? new Date(formData.get('dataNascimento') as string)
      : null,
    matricula: formData.get('matricula'),
    email: formData.get('email'),
    dataAdmissao: formData.get('dataAdmissao') ? new Date(formData.get('dataAdmissao') as string) : null,
    regimeJuridico: formData.get('regimeJuridico') || null,
    regimeTrabalho: formData.get('regimeTrabalho') || null,
    regimeDataAplicacao: formData.get('regimeDataAplicacao')
      ? new Date(formData.get('regimeDataAplicacao') as string)
      : null,
    cargos: relationsResult.data.cargos,
    telefones: relationsResult.data.telefones,
    documentos: relationsResult.data.documentos,
    contasBancarias: relationsResult.data.contasBancarias,
    ativo: formData.get('ativo'),
  })

  if (!parsed.success) {
    const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([field, errors]) => `${errors?.join(', ')}`)
      .join(' ')
    return redirect(`/docentes/novo?erro=${encodeURIComponent(errorMessages)}`)
  }

  try {
    await docenteService.create(parsed.data)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return redirect('/docentes/novo?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida')
    }
    if (error instanceof ConflictError) {
      return redirect(`/docentes/novo?erro=${encodeURIComponent(error.message)}`)
    }
    console.error('Erro ao criar docente:', error)
    return redirect(`/docentes/novo?erro=${encodeURIComponent('Erro ao criar docente.')}`)
  }
  revalidatePath('/docentes')
  return redirect('/docentes?sucesso=Docente criado com sucesso.')
}

export async function updateDocenteAction(formData: FormData): Promise<void> {
  const id = parseInt(formData.get('id') as string, 10)

  await ensureAuthenticated()
  await assertSameOriginRequest()

  const relationsResult = parseRelatedCollections(formData)
  if (!relationsResult.success) {
    return redirect(`/docentes/${id}?erro=${encodeURIComponent(relationsResult.error)}`)
  }

  const parsed = updateDocenteSchema.safeParse({
    id,
    nome: formData.get('nome'),
    endereco: formData.get('endereco') || null,
    dataNascimento: formData.get('dataNascimento')
      ? new Date(formData.get('dataNascimento') as string)
      : null,
    matricula: formData.get('matricula'),
    email: formData.get('email'),
    dataAdmissao: formData.get('dataAdmissao') ? new Date(formData.get('dataAdmissao') as string) : null,
    regimeJuridico: formData.get('regimeJuridico') || null,
    regimeTrabalho: formData.get('regimeTrabalho') || null,
    regimeDataAplicacao: formData.get('regimeDataAplicacao')
      ? new Date(formData.get('regimeDataAplicacao') as string)
      : null,
    cargos: relationsResult.data.cargos,
    telefones: relationsResult.data.telefones,
    documentos: relationsResult.data.documentos,
    contasBancarias: relationsResult.data.contasBancarias,
    ativo: formData.get('ativo'),
  })

  if (!parsed.success) {
    const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('; ')
    return redirect(`/docentes/${id}?erro=${encodeURIComponent(errorMessages)}`)
  }

  try {
    await docenteService.update(parsed.data)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return redirect(`/docentes/${id}?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida`)
    }
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      return redirect(`/docentes/${id}?erro=${encodeURIComponent(error.message)}`)
    }
    console.error('Erro ao atualizar docente:', error)
    return redirect(`/docentes/${id}?erro=${encodeURIComponent('Erro ao atualizar docente.')}`)
  }
  revalidatePath('/docentes')
  revalidatePath(`/docentes/${id}`)
  return redirect(`/docentes/${id}?sucesso=Docente atualizado com sucesso.`)
}

export async function deleteDocenteAction(id: number): Promise<void> {
  await ensureAuthenticated()
  await assertSameOriginRequest()

  try {
    const idParsed = docenteIdSchema.parse({ id })
    await docenteService.delete(idParsed.id)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return redirect('/docentes?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida')
    }
    if (error instanceof NotFoundError) {
      return redirect(`/docentes?erro=${encodeURIComponent(error.message)}`)
    }
    console.error('Erro ao deletar docente:', error)
    return redirect(`/docentes?erro=${encodeURIComponent('Erro ao deletar docente.')}`)
  }
  revalidatePath('/docentes')
  return redirect('/docentes?sucesso=Docente deletado com sucesso.')
}
