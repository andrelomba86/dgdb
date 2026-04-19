import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ConflictError, ForbiddenError, NotFoundError } from '@/lib/errors'

const mocks = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  revalidatePath: vi.fn(),
  requireAuthenticatedUser: vi.fn(),
  assertSameOriginRequest: vi.fn(),
  docenteList: vi.fn(),
  docenteGetById: vi.fn(),
  docenteCreate: vi.fn(),
  docenteUpdate: vi.fn(),
  docenteDelete: vi.fn(),
  listAllForExport: vi.fn(),
  buildCsv: vi.fn(),
  buildPdf: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}))

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}))

vi.mock('@/lib/auth-guard', () => ({
  requireAuthenticatedUser: mocks.requireAuthenticatedUser,
}))

vi.mock('@/lib/csrf', () => ({
  assertSameOriginRequest: mocks.assertSameOriginRequest,
}))

vi.mock('@/services/docente-service', () => ({
  docenteService: {
    list: mocks.docenteList,
    getById: mocks.docenteGetById,
    create: mocks.docenteCreate,
    update: mocks.docenteUpdate,
    delete: mocks.docenteDelete,
    listAllForExport: mocks.listAllForExport,
  },
}))

vi.mock('@/lib/docente-export', () => ({
  buildDocentesCsvExport: mocks.buildCsv,
  buildDocentesPdfExport: mocks.buildPdf,
}))

import {
  createDocenteAction,
  deleteDocenteAction,
  exportDocentesCsvAction,
  listDocentesAction,
} from '@/actions/docente-actions'

const createBaseFormData = () => {
  const formData = new FormData()
  formData.set('nome', 'Maria Souza')
  formData.set('matricula', 'MAT-1')
  formData.set('email', 'maria@dgdb.com')
  formData.set('dataAdmissao', '2024-01-10')
  formData.set('ativo', 'on')
  formData.set('progressoesData', '[]')
  formData.set('telefonesData', '[]')
  formData.set('documentosData', '[]')
  formData.set('contasBancariasData', '[]')
  return formData
}

describe('actions/docente-actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.requireAuthenticatedUser.mockResolvedValue({ id: 1 })
    mocks.assertSameOriginRequest.mockResolvedValue(undefined)
  })

  it('retorna erro para filtros invalidos na listagem', async () => {
    const result = await listDocentesAction({ page: 0 })

    expect(result).toEqual({
      success: false,
      error: 'Filtros inválidos para listagem de docentes.',
    })
    expect(mocks.docenteList).not.toHaveBeenCalled()
  })

  it('lista docentes com sucesso quando filtros sao validos', async () => {
    mocks.docenteList.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 10 })

    const result = await listDocentesAction({ nome: 'Maria' })

    expect(result.success).toBe(true)
    expect(mocks.docenteList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      nome: 'Maria',
      ativo: undefined,
      sortBy: 'nome',
      sortOrder: 'asc',
    })
  })

  it('retorna erro de origem invalida na exportacao csv', async () => {
    mocks.assertSameOriginRequest.mockRejectedValue(new ForbiddenError('origem invalida'))

    const result = await exportDocentesCsvAction({ nome: 'Maria' })
    expect(result).toEqual({
      success: false,
      error: 'Origem da requisição inválida para exportação.',
    })
  })

  it('preserva estado do formulario quando payload de colecao e invalido', async () => {
    const formData = createBaseFormData()
    formData.set('telefonesData', '{nao-e-json')

    const result = await createDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Telefones: payload inválido.')
    expect(result.formValues?.nome).toBe('Maria Souza')
    expect(mocks.docenteCreate).not.toHaveBeenCalled()
  })

  it('remove linhas vazias das colecoes e chama servico com dados validos', async () => {
    const formData = createBaseFormData()
    formData.set(
      'telefonesData',
      JSON.stringify([
        { telefone: '', tipo: '' },
        { telefone: '(11)99999-9999', tipo: 'celular' },
      ]),
    )

    mocks.docenteCreate.mockResolvedValue({ id: 1 })

    await expect(createDocenteAction({ result: {} }, formData)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes?sucesso=Docente criado com sucesso.',
    )

    expect(mocks.docenteCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Maria Souza',
        telefones: [{ telefone: '(11)99999-9999', tipo: 'celular' }],
      }),
    )
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/docentes')
  })

  it('preserva estado quando servico retorna conflito', async () => {
    const formData = createBaseFormData()
    mocks.docenteCreate.mockRejectedValue(new ConflictError('Já existe um docente com esta matrícula.'))

    const result = await createDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Já existe um docente com esta matrícula.')
    expect(result.formValues?.matricula).toBe('MAT-1')
  })

  it('redireciona com erro quando delete recebe not found', async () => {
    mocks.docenteDelete.mockRejectedValue(new NotFoundError('Docente não encontrado.'))

    await expect(deleteDocenteAction(999)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes?erro=Docente%20n%C3%A3o%20encontrado.',
    )
  })
})
