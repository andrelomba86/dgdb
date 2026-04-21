import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { StartedTestContainer } from 'testcontainers'

import { setupDbTestContext, shouldRunDbTests, teardownDbTestContext } from '../db-test-env'
import { ConflictError } from '@/lib/errors'
import { DocenteService } from '@/services/docente-service'

const runDbTests = shouldRunDbTests

describe.skipIf(!runDbTests)('integration/services/docente-service (mysql)', () => {
  let container: StartedTestContainer | undefined
  let databaseUrl: string

  beforeAll(async () => {
    const context = await setupDbTestContext()
    container = context.container
    databaseUrl = context.databaseUrl
  }, 120000)

  afterAll(async () => {
    await teardownDbTestContext({ container, databaseUrl })
  })

  it('cria, atualiza e remove docente via service com normalizacao', async () => {
    const { prisma } = await import('@/lib/prisma')
    const service = new DocenteService()
    const runId = Math.random().toString(36).slice(2, 6).toUpperCase()

    const created = await service.create({
      nome: '  Ana   Service  ',
      endereco: ' Rua A ',
      dataNascimento: new Date('1990-05-10'),
      matricula: ` M${runId}01 `,
      email: ` ANA.SERVICE.${runId}@EXAMPLE.COM `,
      dataAdmissao: new Date('2021-01-10'),
      regimeJuridico: ' CLT ',
      regimeTrabalho: ' Integral ',
      regimeDataAplicacao: new Date('2021-02-10'),
      ativo: true,
      progressoes: [
        {
          funcao: ' Professora ',
          dataInicio: new Date('2021-01-10'),
          dataTermino: null,
          referencia: ' A1 ',
        },
      ],
      telefones: [
        {
          telefone: ' (11) 99999-0000 ',
          tipo: 'celular',
        },
      ],
      documentos: [
        {
          tipo: ' cpf ',
          documento: ' ab-123 ',
        },
      ],
      contasBancarias: [
        {
          banco: ' ita ',
          agencia: ' 1234-5 ',
          conta: ' 1111-2 ',
        },
      ],
    })

    expect(created.nome).toBe('Ana Service')
    expect(created.email).toBe(`ana.service.${runId.toLowerCase()}@example.com`)
    expect(created.matricula).toBe(`M${runId}01`)

    const updated = await service.update({
      id: created.id,
      nome: 'Ana Service Atualizada',
      endereco: 'Rua B',
      dataNascimento: new Date('1990-05-10'),
      matricula: `M${runId}01`,
      email: `ana.service.updated.${runId.toLowerCase()}@example.com`,
      dataAdmissao: new Date('2021-01-10'),
      regimeJuridico: 'CLT',
      regimeTrabalho: 'Parcial',
      regimeDataAplicacao: new Date('2021-03-10'),
      ativo: false,
      progressoes: [
        {
          id: created.progressoes[0]?.id,
          funcao: 'Coordenadora',
          dataInicio: new Date('2021-01-10'),
          dataTermino: new Date('2022-01-10'),
          referencia: 'B2',
        },
      ],
      telefones: [
        {
          id: created.telefones[0]?.id,
          telefone: '11988887777',
          tipo: 'celular',
        },
      ],
      documentos: [
        {
          id: created.documentos[0]?.id,
          tipo: 'CPF',
          documento: '99999999999',
        },
      ],
      contasBancarias: [
        {
          id: created.contasBancarias[0]?.id,
          banco: '001',
          agencia: '1234',
          conta: '2222-3',
        },
      ],
    })

    expect(updated.nome).toBe('Ana Service Atualizada')
    expect(updated.ativo).toBe(false)

    await service.delete(created.id)
    const fromDb = await prisma.docente.findUnique({ where: { id: created.id } })
    expect(fromDb).toBeNull()

    await prisma.docente.deleteMany({ where: { id: created.id } })
  })

  it('rejeita duplicidade de telefone e de matricula', async () => {
    const { prisma } = await import('@/lib/prisma')
    const service = new DocenteService()
    const runId = Math.random().toString(36).slice(2, 6).toUpperCase()

    const created = await service.create({
      nome: 'Docente A',
      endereco: null,
      dataNascimento: null,
      matricula: `A${runId}1`,
      email: `docente.a.${runId.toLowerCase()}@example.com`,
      dataAdmissao: new Date('2020-01-10'),
      regimeJuridico: null,
      regimeTrabalho: null,
      regimeDataAplicacao: null,
      ativo: true,
      progressoes: [],
      telefones: [],
      documentos: [],
      contasBancarias: [],
    })

    await expect(
      service.create({
        nome: 'Docente B',
        endereco: null,
        dataNascimento: null,
        matricula: `A${runId}1`,
        email: `docente.b.${runId.toLowerCase()}@example.com`,
        dataAdmissao: new Date('2020-01-10'),
        regimeJuridico: null,
        regimeTrabalho: null,
        regimeDataAplicacao: null,
        ativo: true,
        progressoes: [],
        telefones: [],
        documentos: [],
        contasBancarias: [],
      }),
    ).rejects.toThrow(ConflictError)

    await expect(
      service.create({
        nome: 'Docente C',
        endereco: null,
        dataNascimento: null,
        matricula: `A${runId}3`,
        email: `docente.c.${runId.toLowerCase()}@example.com`,
        dataAdmissao: new Date('2020-01-10'),
        regimeJuridico: null,
        regimeTrabalho: null,
        regimeDataAplicacao: null,
        ativo: true,
        progressoes: [],
        telefones: [
          { telefone: '11999990000', tipo: 'celular' },
          { telefone: '11 99999 0000', tipo: 'institucional' },
        ],
        documentos: [],
        contasBancarias: [],
      }),
    ).rejects.toThrow('Há telefones duplicados no cadastro informado.')

    await prisma.docente.deleteMany({ where: { id: created.id } })
  })
})
