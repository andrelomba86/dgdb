import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ConflictError, NotFoundError } from '@/lib/errors'
import { DocenteService } from '@/services/docente-service'
import type { DocenteAggregate, DocenteListResult } from '@/types/docente'
import type { CreateDocenteInput, DocenteListInput, UpdateDocenteInput } from '@/validators/docente'

const createDocenteAggregate = (): DocenteAggregate => ({
  id: 1,
  nome: 'Ana Paula',
  endereco: 'Rua A',
  dataNascimento: new Date('1990-01-01T00:00:00.000Z'),
  matricula: 'ABC123',
  email: 'ana@example.com',
  dataAdmissao: new Date('2020-01-01T00:00:00.000Z'),
  regimeJuridico: 'CLT',
  regimeTrabalho: 'Integral',
  regimeDataAplicacao: new Date('2020-01-01T00:00:00.000Z'),
  ativo: true,
  progressoes: [],
  telefones: [],
  documentos: [],
  contasBancarias: [],
})

const createCreateInput = (): CreateDocenteInput => ({
  nome: '  Ana   Paula  ',
  endereco: ' Rua A ',
  dataNascimento: new Date('1990-01-01T00:00:00.000Z'),
  matricula: ' AB C123 ',
  email: ' ANA@EXAMPLE.COM ',
  dataAdmissao: new Date('2020-01-01T00:00:00.000Z'),
  regimeJuridico: ' CLT ',
  regimeTrabalho: ' Integral ',
  regimeDataAplicacao: new Date('2020-02-01T00:00:00.000Z'),
  ativo: true,
  progressoes: [
    {
      funcao: ' Professora ',
      dataInicio: new Date('2020-01-01T00:00:00.000Z'),
      dataTermino: null,
      referencia: ' N1 ',
    },
  ],
  telefones: [{ telefone: ' (11) 99999-9999 ', tipo: 'celular' }],
  documentos: [{ tipo: ' cpf ', documento: ' ab-123 ' }],
  contasBancarias: [{ banco: ' ita ', agencia: ' 1234-5 ', conta: ' 0001-9 ' }],
})

const createUpdateInput = (): UpdateDocenteInput => ({
  ...createCreateInput(),
  id: 7,
  progressoes: [
    {
      id: 33,
      funcao: ' Coordenadora ',
      dataInicio: new Date('2021-01-01T00:00:00.000Z'),
      dataTermino: null,
      referencia: ' B2 ',
    },
    {
      funcao: ' Nova função ',
      dataInicio: new Date('2022-01-01T00:00:00.000Z'),
      dataTermino: null,
      referencia: ' C3 ',
    },
  ],
  telefones: [
    { id: 44, telefone: ' 1199999-9999 ', tipo: 'celular' },
    { telefone: ' 113333-4444 ', tipo: 'comercial' },
  ],
  documentos: [
    { id: 55, tipo: ' rg ', documento: ' 001 ' },
    { tipo: ' cpf ', documento: ' 999 ' },
  ],
  contasBancarias: [
    { id: 66, banco: '001', agencia: '1234', conta: '0001' },
    { banco: '237', agencia: '4321', conta: '9999' },
  ],
})

const createMocks = () => {
  const repository = {
    list: vi.fn(),
    listAll: vi.fn(),
    findById: vi.fn(),
    findConflict: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }

  const service = new DocenteService(repository as never)
  return { repository, service }
}

describe('services/docente-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista com filtro de nome normalizado por trim e exporta todos com ordenacao', async () => {
    const { repository, service } = createMocks()
    const listResult: DocenteListResult = {
      items: [createDocenteAggregate()],
      total: 1,
      page: 1,
      pageSize: 10,
    }
    const filters: DocenteListInput = {
      page: 1,
      pageSize: 10,
      nome: '  Ana  ',
      ativo: true,
      sortBy: 'nome',
      sortOrder: 'asc',
    }

    repository.list.mockResolvedValue(listResult)
    repository.listAll.mockResolvedValue([createDocenteAggregate()])

    await expect(service.list(filters)).resolves.toEqual(listResult)
    expect(repository.list).toHaveBeenCalledWith({ ...filters, nome: 'Ana' })

    await service.listAllForExport(filters)
    expect(repository.listAll).toHaveBeenCalledWith({ nome: 'Ana', ativo: true }, 'nome', 'asc')

    await service.list({ ...filters, nome: undefined, ativo: undefined })
    expect(repository.list).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: undefined,
        ativo: undefined,
      }),
    )
  })

  it('retorna docente por id e lanca erro quando nao encontra', async () => {
    const { repository, service } = createMocks()
    const docente = createDocenteAggregate()

    repository.findById.mockResolvedValue(docente)
    await expect(service.getById(1)).resolves.toEqual(docente)

    repository.findById.mockResolvedValue(null)
    await expect(service.getById(999)).rejects.toThrow(NotFoundError)
  })

  it('cria docente com payload normalizado e relacoes mapeadas', async () => {
    const { repository, service } = createMocks()
    const input = createCreateInput()
    const created = createDocenteAggregate()

    repository.findConflict.mockResolvedValue(null)
    repository.create.mockResolvedValue(created)

    await expect(service.create(input)).resolves.toEqual(created)

    expect(repository.findConflict).toHaveBeenCalledWith({
      matricula: 'ABC123',
      email: 'ana@example.com',
      ignoreId: undefined,
    })

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Ana Paula',
        endereco: 'Rua A',
        matricula: 'ABC123',
        email: 'ana@example.com',
        regimeJuridico: 'CLT',
        regimeTrabalho: 'Integral',
        ativo: true,
        dataNascimento: expect.any(Date),
        dataAdmissao: expect.any(Date),
        regimeDataAplicacao: expect.any(Date),
        progressoes: {
          create: [
            {
              funcao: 'Professora',
              dataInicio: expect.any(Date),
              dataTermino: null,
              referencia: 'N1',
            },
          ],
        },
        telefones: {
          create: [{ telefone: '(11)99999-9999', tipo: 'celular' }],
        },
        documentos: {
          create: [{ tipo: 'cpf', documento: 'AB-123' }],
        },
        contasBancarias: {
          create: [{ banco: 'ITA', agencia: '1234-5', conta: '0001-9' }],
        },
      }),
    )
  })

  it('lanca conflito para docente ja existente por matricula ou email', async () => {
    const { repository, service } = createMocks()
    const input = createCreateInput()

    repository.findConflict.mockResolvedValue({ id: 1, matricula: 'ABC123', email: null })

    await expect(service.create(input)).rejects.toThrow(ConflictError)

    repository.findConflict.mockResolvedValue({ id: 2, matricula: 'OUTRA', email: 'ana@example.com' })

    await expect(service.create(input)).rejects.toThrow(ConflictError)
  })

  it('lanca conflito para colecoes com itens duplicados', async () => {
    const { repository, service } = createMocks()
    const duplicatedPhoneInput: CreateDocenteInput = {
      ...createCreateInput(),
      telefones: [
        { telefone: '11999999999', tipo: 'celular' },
        { telefone: '11 99999 9999', tipo: 'comercial' },
      ],
    }

    repository.findConflict.mockResolvedValue(null)

    await expect(service.create(duplicatedPhoneInput)).rejects.toThrow(ConflictError)
    expect(repository.create).not.toHaveBeenCalled()

    const duplicatedDocumentInput: CreateDocenteInput = {
      ...createCreateInput(),
      documentos: [
        { tipo: 'cpf', documento: 'ab-123' },
        { tipo: ' CPF ', documento: ' AB-123 ' },
      ],
    }

    await expect(service.create(duplicatedDocumentInput)).rejects.toThrow(ConflictError)

    const duplicatedBankInput: CreateDocenteInput = {
      ...createCreateInput(),
      contasBancarias: [
        { banco: '001', agencia: '1234', conta: '0001' },
        { banco: ' 001 ', agencia: ' 12 34 ', conta: ' 00 01 ' },
      ],
    }

    await expect(service.create(duplicatedBankInput)).rejects.toThrow(ConflictError)
  })

  it('converte valores invalidos de data e tipos inesperados para null no payload', async () => {
    const { repository, service } = createMocks()
    const input = createCreateInput()
    const created = createDocenteAggregate()

    repository.findConflict.mockResolvedValue(null)
    repository.create.mockResolvedValue(created)

    await service.create({
      ...input,
      dataNascimento: new Date('invalid') as unknown as Date,
      regimeDataAplicacao: { any: 'object' } as unknown as Date,
      progressoes: [
        {
          ...input.progressoes[0],
          dataTermino: new Date('invalid') as unknown as Date,
        },
      ],
    })

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        dataNascimento: null,
        regimeDataAplicacao: null,
        progressoes: {
          create: [
            expect.objectContaining({
              dataTermino: null,
            }),
          ],
        },
      }),
    )

    await service.create({
      ...input,
      dataAdmissao: 1713398400000 as unknown as Date,
      endereco: '',
      matricula: '',
      email: '',
      regimeJuridico: '',
      regimeTrabalho: '',
    })

    expect(repository.create).toHaveBeenLastCalledWith(
      expect.objectContaining({
        dataAdmissao: expect.any(Date),
        endereco: null,
        matricula: null,
        email: null,
        regimeJuridico: null,
        regimeTrabalho: null,
      }),
    )
  })

  it('atualiza docente existente com upsert de relacoes e exclui docente existente', async () => {
    const { repository, service } = createMocks()
    const updateInput = createUpdateInput()
    const updated = createDocenteAggregate()

    repository.findById.mockResolvedValue(createDocenteAggregate())
    repository.findConflict.mockResolvedValue(null)
    repository.update.mockResolvedValue(updated)

    await expect(service.update(updateInput)).resolves.toEqual(updated)

    expect(repository.findConflict).toHaveBeenCalledWith({
      matricula: 'ABC123',
      email: 'ana@example.com',
      ignoreId: 7,
    })
    expect(repository.update).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        nome: 'Ana Paula',
        progressoes: expect.objectContaining({
          deleteMany: { id: { notIn: [33] } },
        }),
        telefones: expect.objectContaining({
          deleteMany: { id: { notIn: [44] } },
        }),
        documentos: expect.objectContaining({
          deleteMany: { id: { notIn: [55] } },
        }),
        contasBancarias: expect.objectContaining({
          deleteMany: { id: { notIn: [66] } },
        }),
      }),
    )

    await service.delete(7)
    expect(repository.delete).toHaveBeenCalledWith(7)
  })
})
