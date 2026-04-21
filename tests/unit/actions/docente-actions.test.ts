import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
  exportDocentesPdfAction,
  getDocenteAction,
  listDocentesAction,
  updateDocenteAction,
} from '@/actions/docente-actions'

const createBaseFormData = () => {
  const formData = new FormData()
  formData.set('nome', 'Maria Souza')
  formData.set('matricula', 'MAT-1')
  formData.set('email', 'maria@dgdb.com')
  formData.set('dataAdmissao', '2024-01-10')
  formData.set('ativo', 'on')
  formData.set('progressoesData', '[]')
  formData.set('progressaoFuncoesSugeridasData', '[]')
  formData.set('progressaoReferenciasSugeridasData', '[]')
  formData.set('telefonesData', '[]')
  formData.set('telefoneTiposSugeridosData', '[]')
  formData.set('documentoTiposSugeridosData', '[]')
  formData.set('documentosData', '[]')
  formData.set('contasBancariasData', '[]')
  return formData
}

describe('actions/docente-actions', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.requireAuthenticatedUser.mockResolvedValue({ id: 1 })
    mocks.assertSameOriginRequest.mockResolvedValue(undefined)
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
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

  it('retorna erro generico quando listagem falha internamente', async () => {
    mocks.docenteList.mockRejectedValue(new Error('falha interna'))

    const result = await listDocentesAction({ nome: 'Maria' })

    expect(result).toEqual({
      success: false,
      error: 'Erro ao listar docentes.',
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

  it('retorna erro para filtros invalidos na exportacao csv', async () => {
    const result = await exportDocentesCsvAction({ sortBy: 'invalido' } as unknown as Parameters<
      typeof exportDocentesCsvAction
    >[0])

    expect(result).toEqual({
      success: false,
      error: 'Filtros inválidos para exportação CSV.',
    })
    expect(mocks.listAllForExport).not.toHaveBeenCalled()
  })

  it('exporta csv com sucesso quando filtros sao validos', async () => {
    const payload = {
      filename: 'docentes.csv',
      mimeType: 'text/csv',
      content: 'id,nome',
      encoding: 'utf-8',
    } as const
    mocks.listAllForExport.mockResolvedValue([{ id: 1, nome: 'Maria' }])
    mocks.buildCsv.mockReturnValue(payload)

    const result = await exportDocentesCsvAction({ nome: ' Maria ' })

    expect(result).toEqual({ success: true, data: payload })
    expect(mocks.listAllForExport).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      nome: 'Maria',
      ativo: undefined,
      sortBy: 'nome',
      sortOrder: 'asc',
    })
    expect(mocks.buildCsv).toHaveBeenCalled()
  })

  it('retorna erro generico quando exportacao csv falha', async () => {
    mocks.listAllForExport.mockRejectedValue(new Error('boom'))

    const result = await exportDocentesCsvAction({ nome: 'Maria' })

    expect(result).toEqual({
      success: false,
      error: 'Erro ao exportar docentes em CSV.',
    })
  })

  it('retorna erro para filtros invalidos na exportacao pdf', async () => {
    const result = await exportDocentesPdfAction({ sortBy: 'invalido' } as unknown as Parameters<
      typeof exportDocentesPdfAction
    >[0])

    expect(result).toEqual({
      success: false,
      error: 'Filtros inválidos para exportação PDF.',
    })
    expect(mocks.buildPdf).not.toHaveBeenCalled()
  })

  it('retorna erro de origem invalida na exportacao pdf', async () => {
    mocks.assertSameOriginRequest.mockRejectedValue(new ForbiddenError('origem invalida'))

    const result = await exportDocentesPdfAction({ nome: 'Maria' })
    expect(result).toEqual({
      success: false,
      error: 'Origem da requisição inválida para exportação.',
    })
  })

  it('exporta pdf com sucesso quando filtros sao validos', async () => {
    const payload = {
      filename: 'docentes.pdf',
      mimeType: 'application/pdf',
      content: 'BASE64',
      encoding: 'base64',
    } as const
    mocks.listAllForExport.mockResolvedValue([{ id: 1, nome: 'Maria' }])
    mocks.buildPdf.mockResolvedValue(payload)

    const result = await exportDocentesPdfAction({ nome: 'Maria' })

    expect(result).toEqual({ success: true, data: payload })
    expect(mocks.buildPdf).toHaveBeenCalled()
  })

  it('retorna erro generico quando exportacao pdf falha', async () => {
    mocks.listAllForExport.mockRejectedValue(new Error('boom'))

    const result = await exportDocentesPdfAction({ nome: 'Maria' })

    expect(result).toEqual({
      success: false,
      error: 'Erro ao exportar docentes em PDF.',
    })
  })

  it('busca docente por id com sucesso', async () => {
    mocks.docenteGetById.mockResolvedValue({ id: 10, nome: 'Maria' })

    const result = await getDocenteAction(10)

    expect(result).toEqual({
      success: true,
      data: { id: 10, nome: 'Maria' },
    })
  })

  it('retorna erro amigavel quando docente nao e encontrado no get', async () => {
    mocks.docenteGetById.mockRejectedValue(new NotFoundError('Docente não encontrado.'))

    const result = await getDocenteAction(123)

    expect(result).toEqual({
      success: false,
      error: 'Docente não encontrado.',
    })
  })

  it('retorna erro generico quando get falha', async () => {
    mocks.docenteGetById.mockRejectedValue(new Error('boom'))

    const result = await getDocenteAction(10)

    expect(result).toEqual({
      success: false,
      error: 'Erro ao buscar docente.',
    })
  })

  it('preserva estado do formulario quando payload de colecao e invalido', async () => {
    const formData = createBaseFormData()
    formData.set('progressaoFuncoesSugeridasData', JSON.stringify(['Docente']))
    formData.set('progressaoReferenciasSugeridasData', JSON.stringify(['N1']))
    formData.set('telefonesData', '{nao-e-json')

    const result = await createDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Telefones: payload inválido.')
    expect(result.formValues?.nome).toBe('Maria Souza')
    expect(result.relatedInitialData?.progressaoFuncoesSugeridas).toEqual(['Docente'])
    expect(result.relatedInitialData?.progressaoReferenciasSugeridas).toEqual(['N1'])
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

  it('preserva estado quando validacao do create falha', async () => {
    const formData = createBaseFormData()
    formData.set('nome', '')

    const result = await createDocenteAction({ result: {} }, formData)

    expect(result.result.error).toContain('Nome é obrigatório.')
    expect(result.formValues?.nome).toBe('')
    expect(mocks.docenteCreate).not.toHaveBeenCalled()
  })

  it('preserva estado quando update tem erro de validacao', async () => {
    const formData = createBaseFormData()
    formData.set('id', '7')
    formData.set('nome', '')

    const result = await updateDocenteAction({ result: {} }, formData)

    expect(result.result.error).toContain('nome: Nome é obrigatório.')
    expect(result.formValues?.nome).toBe('')
    expect(mocks.docenteUpdate).not.toHaveBeenCalled()
  })

  it('preserva estado quando update recebe payload de colecao invalido', async () => {
    const formData = createBaseFormData()
    formData.set('id', '7')
    formData.set('documentosData', '{invalido')

    const result = await updateDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Documentos: payload inválido.')
    expect(result.formValues?.nome).toBe('Maria Souza')
    expect(mocks.docenteUpdate).not.toHaveBeenCalled()
  })

  it('retorna erro de conflito no update preservando estado', async () => {
    const formData = createBaseFormData()
    formData.set('id', '7')
    mocks.docenteUpdate.mockRejectedValue(new ConflictError('Já existe um docente com este e-mail.'))

    const result = await updateDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Já existe um docente com este e-mail.')
    expect(result.formValues?.nome).toBe('Maria Souza')
  })

  it('retorna erro de not found no update preservando estado', async () => {
    const formData = createBaseFormData()
    formData.set('id', '7')
    mocks.docenteUpdate.mockRejectedValue(new NotFoundError('Docente não encontrado.'))

    const result = await updateDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Docente não encontrado.')
  })

  it('retorna erro generico no update preservando estado', async () => {
    const formData = createBaseFormData()
    formData.set('id', '7')
    mocks.docenteUpdate.mockRejectedValue(new Error('falha'))

    const result = await updateDocenteAction({ result: {} }, formData)

    expect(result.result.error).toBe('Erro ao atualizar docente.')
  })

  it('redireciona no update com sucesso', async () => {
    const formData = createBaseFormData()
    formData.set('id', '7')
    mocks.docenteUpdate.mockResolvedValue({ id: 7 })

    await expect(updateDocenteAction({ result: {} }, formData)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes/7?sucesso=Docente atualizado com sucesso.',
    )

    expect(mocks.revalidatePath).toHaveBeenCalledWith('/docentes')
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/docentes/7')
  })

  it('redireciona com erro quando delete recebe not found', async () => {
    mocks.docenteDelete.mockRejectedValue(new NotFoundError('Docente não encontrado.'))

    await expect(deleteDocenteAction(999)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes?erro=Docente%20n%C3%A3o%20encontrado.',
    )
  })

  it('redireciona com erro de requisicao invalida quando delete recebe forbidden', async () => {
    mocks.docenteDelete.mockRejectedValue(new ForbiddenError('Sem origem'))

    await expect(deleteDocenteAction(10)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida',
    )
  })

  it('redireciona com erro generico quando delete falha', async () => {
    mocks.docenteDelete.mockRejectedValue(new Error('boom'))

    await expect(deleteDocenteAction(10)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes?erro=Erro%20ao%20deletar%20docente.',
    )
  })

  it('redireciona com sucesso quando delete conclui', async () => {
    mocks.docenteDelete.mockResolvedValue(undefined)

    await expect(deleteDocenteAction(10)).rejects.toThrow(
      'NEXT_REDIRECT:/docentes?sucesso=Docente deletado com sucesso.',
    )
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/docentes')
  })
})
