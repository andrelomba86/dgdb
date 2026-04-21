'use server'

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
import { progressaoInputSchema } from '@/validators/progressao'
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
import { DocenteFormValues } from '@/components/docente-form-fields'
import { RelatedEntitiesInitialData } from '@/components/docente-related-fields'

type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}

export type DocenteFormState = {
  result: {
    success?: string
    error?: string
  }
  formValues?: DocenteFormValues
  relatedInitialData?: RelatedEntitiesInitialData
}

async function ensureAuthenticated() {
  await requireAuthenticatedUser()
}

function logActionError(context: string, error: unknown) {
  console.error(`Erro ao ${context}:`, error)
}

function actionFailure<T>(context: string): ActionResult<T> {
  return {
    success: false,
    error: `Erro ao ${context}.`,
  }
}

function formActionFailure(
  context: string,
  preservedState: Pick<DocenteFormState, 'formValues' | 'relatedInitialData'>,
): DocenteFormState {
  return {
    result: {
      error: `Erro ao ${context}.`,
    },
    ...preservedState,
  }
}

function formatZodIssues(error: z.ZodError) {
  return error.issues.map(issue => `${issue.message}`).join(' ')
}

const toTrimmedString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

function isEmptyProgressaoRow(value: unknown) {
  const row = value as {
    funcao?: unknown
    dataInicio?: unknown
    dataTermino?: unknown
    referencia?: unknown
  }
  return (
    toTrimmedString(row.funcao) === '' &&
    toTrimmedString(row.dataInicio) === '' &&
    toTrimmedString(row.dataTermino) === '' &&
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
        error: `[${label}]: ${formatZodIssues(parsed.error)}`,
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
  const progressoes = parseJsonArrayField(
    formData,
    'progressoesData',
    progressaoInputSchema,
    'Progressões',
    isEmptyProgressaoRow,
  )
  if (!progressoes.success) {
    return progressoes
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
      progressoes: progressoes.data,
      telefones: telefones.data,
      documentos: documentos.data,
      contasBancarias: contasBancarias.data,
    },
  }
}

function toInputString(value: unknown) {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function toOptionalId(value: unknown) {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }

  return undefined
}

function parseRawArrayField(formData: FormData, fieldName: string) {
  const rawValue = formData.get(fieldName)

  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildDocenteFormValues(formData: FormData): DocenteFormValues {
  return {
    nome: toInputString(formData.get('nome')),
    dataNascimento: toInputString(formData.get('dataNascimento')),
    endereco: toInputString(formData.get('endereco')),
    matricula: toInputString(formData.get('matricula')),
    email: toInputString(formData.get('email')),
    dataAdmissao: toInputString(formData.get('dataAdmissao')),
    regimeJuridico: toInputString(formData.get('regimeJuridico')),
    regimeTrabalho: toInputString(formData.get('regimeTrabalho')),
    regimeDataAplicacao: toInputString(formData.get('regimeDataAplicacao')),
    ativo: formData.get('ativo') === 'on',
  }
}

function buildRelatedInitialData(formData: FormData): RelatedEntitiesInitialData {
  const progressoes = parseRawArrayField(formData, 'progressoesData')
  const telefones = parseRawArrayField(formData, 'telefonesData')
  const telefoneTiposSugeridos = parseRawArrayField(formData, 'telefoneTiposSugeridosData')
  const documentos = parseRawArrayField(formData, 'documentosData')
  const contasBancarias = parseRawArrayField(formData, 'contasBancariasData')

  return {
    progressoes: progressoes.map(progressao => {
      const value = progressao as Record<string, unknown>
      return {
        id: toOptionalId(value.id),
        funcao: toInputString(value.funcao),
        dataInicio: toInputString(value.dataInicio),
        dataTermino: toInputString(value.dataTermino),
        referencia: toInputString(value.referencia),
      }
    }),
    telefones: telefones.map(telefone => {
      const value = telefone as Record<string, unknown>
      return {
        id: toOptionalId(value.id),
        telefone: toInputString(value.telefone),
        tipo: toInputString(value.tipo),
      }
    }),
    documentos: documentos.map(documento => {
      const value = documento as Record<string, unknown>
      return {
        id: toOptionalId(value.id),
        tipo: toInputString(value.tipo),
        documento: toInputString(value.documento),
      }
    }),
    contasBancarias: contasBancarias.map(conta => {
      const value = conta as Record<string, unknown>
      return {
        id: toOptionalId(value.id),
        banco: toInputString(value.banco),
        agencia: toInputString(value.agencia),
        conta: toInputString(value.conta),
      }
    }),
    telefoneTiposSugeridos: telefoneTiposSugeridos
      .map(value => toInputString(value).trim())
      .filter(value => value.length > 0),
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
    logActionError('listar docentes', error)
    return actionFailure<DocenteListResult>('listar docentes')
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

    logActionError('exportar docentes em CSV', error)
    return actionFailure<DocenteExportPayload>('exportar docentes em CSV')
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

    logActionError('exportar docentes em PDF', error)
    return actionFailure<DocenteExportPayload>('exportar docentes em PDF')
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

    logActionError('buscar docente', error)
    return actionFailure<DocenteAggregate>('buscar docente')
  }
}

export async function createDocenteAction(
  _prevState: DocenteFormState,
  formData: FormData,
): Promise<DocenteFormState> {
  await ensureAuthenticated()
  await assertSameOriginRequest()

  const preservedState = {
    formValues: buildDocenteFormValues(formData),
    relatedInitialData: buildRelatedInitialData(formData),
  }

  const relationsResult = parseRelatedCollections(formData)
  if (!relationsResult.success) {
    return { result: { error: relationsResult.error }, ...preservedState }
  }

  const parsed = createDocenteSchema.safeParse({
    nome: formData.get('nome'),
    endereco: formData.get('endereco') || null,
    dataNascimento: formData.get('dataNascimento')
      ? new Date(formData.get('dataNascimento') as string)
      : null,
    matricula: formData.get('matricula') || null,
    email: formData.get('email') || null,
    dataAdmissao: formData.get('dataAdmissao') ? new Date(formData.get('dataAdmissao') as string) : null,
    regimeJuridico: formData.get('regimeJuridico') || null,
    regimeTrabalho: formData.get('regimeTrabalho') || null,
    regimeDataAplicacao: formData.get('regimeDataAplicacao')
      ? new Date(formData.get('regimeDataAplicacao') as string)
      : null,
    progressoes: relationsResult.data.progressoes,
    telefones: relationsResult.data.telefones,
    documentos: relationsResult.data.documentos,
    contasBancarias: relationsResult.data.contasBancarias,
    ativo: formData.get('ativo'),
  })

  if (!parsed.success) {
    const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([, errors]) => (Array.isArray(errors) ? errors.join(', ') : ''))
      .filter(Boolean)
      .join(' ')
    return { result: { error: errorMessages }, ...preservedState }
  }

  try {
    await docenteService.create(parsed.data)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { result: { error: 'Requisição inválida.' }, ...preservedState }
    }
    if (error instanceof ConflictError) {
      return { result: { error: error.message }, ...preservedState }
    }
    logActionError('criar docente', error)
    return formActionFailure('criar docente', preservedState)
  }
  revalidatePath('/docentes')
  redirect('/docentes?sucesso=Docente criado com sucesso.')
  return { result: {} }
}

export async function updateDocenteAction(
  _prevState: DocenteFormState,
  formData: FormData,
): Promise<DocenteFormState> {
  const id = parseInt(formData.get('id') as string, 10)

  await ensureAuthenticated()
  await assertSameOriginRequest()

  const preservedState = {
    formValues: buildDocenteFormValues(formData),
    relatedInitialData: buildRelatedInitialData(formData),
  }

  const relationsResult = parseRelatedCollections(formData)
  if (!relationsResult.success) {
    console.error('Erro ao parsear coleções relacionadas:', relationsResult.error)
    return { result: { error: relationsResult.error }, ...preservedState }
  }

  const parsed = updateDocenteSchema.safeParse({
    id,
    nome: formData.get('nome'),
    endereco: formData.get('endereco') || null,
    dataNascimento: formData.get('dataNascimento')
      ? new Date(formData.get('dataNascimento') as string)
      : null,
    matricula: formData.get('matricula') || null,
    email: formData.get('email') || null,
    dataAdmissao: formData.get('dataAdmissao') ? new Date(formData.get('dataAdmissao') as string) : null,
    regimeJuridico: formData.get('regimeJuridico') || null,
    regimeTrabalho: formData.get('regimeTrabalho') || null,
    regimeDataAplicacao: formData.get('regimeDataAplicacao')
      ? new Date(formData.get('regimeDataAplicacao') as string)
      : null,
    progressoes: relationsResult.data.progressoes,
    telefones: relationsResult.data.telefones,
    documentos: relationsResult.data.documentos,
    contasBancarias: relationsResult.data.contasBancarias,
    ativo: formData.get('ativo'),
  })

  if (!parsed.success) {
    const errorMessages = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([field, errors]) =>
        Array.isArray(errors) && errors.length > 0 ? `${field}: ${errors.join(', ')}` : '',
      )
      .filter(Boolean)
      .join('; ')
    return { result: { error: errorMessages }, ...preservedState }
  }

  try {
    await docenteService.update(parsed.data)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { result: { error: 'Requisição inválida.' }, ...preservedState }
    }
    if (error instanceof NotFoundError) {
      return { result: { error: error.message }, ...preservedState }
    }
    if (error instanceof ConflictError) {
      return {
        result: { error: error.message },
        ...preservedState,
      }
    }
    logActionError('atualizar docente', error)
    return formActionFailure('atualizar docente', preservedState)
  }
  revalidatePath('/docentes')
  revalidatePath(`/docentes/${id}`)
  redirect(`/docentes/${id}?sucesso=Docente atualizado com sucesso.`)
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
    logActionError('deletar docente', error)
    return redirect(`/docentes?erro=${encodeURIComponent('Erro ao deletar docente.')}`)
  }
  revalidatePath('/docentes')
  return redirect('/docentes?sucesso=Docente deletado com sucesso.')
}
