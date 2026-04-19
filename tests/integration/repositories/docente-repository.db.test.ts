import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { StartedTestContainer } from 'testcontainers'

import { setupDbTestContext, shouldRunDbTests, teardownDbTestContext } from '../db-test-env'

const runDbTests = shouldRunDbTests

describe.skipIf(!runDbTests)('integration/repositories/docente-repository (mysql)', () => {
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

  it('cria, lista, encontra conflito, atualiza e remove docente', async () => {
    const { prisma } = await import('@/lib/prisma')
    const { DocenteRepository } = await import('@/repositories/docente-repository')
    const repository = new DocenteRepository()
    const runId = Math.random().toString(36).slice(2, 6).toUpperCase()

    const created = await repository.create({
      nome: `Ana Teste ${runId}`,
      matricula: `M${runId}01`,
      email: `ana.teste.${runId}@example.com`,
      dataAdmissao: new Date('2021-01-10'),
      ativo: true,
      progressoes: {
        create: [
          {
            funcao: 'Professora',
            dataInicio: new Date('2021-01-10'),
          },
        ],
      },
      telefones: {
        create: [
          {
            telefone: '11999990000',
            tipo: 'celular',
          },
        ],
      },
      documentos: {
        create: [
          {
            tipo: 'CPF',
            documento: `DOC-${runId}`,
          },
        ],
      },
      contasBancarias: {
        create: [
          {
            banco: '001',
            agencia: '1234-5',
            conta: '9988-1',
          },
        ],
      },
    })

    expect(created.nome).toBe(`Ana Teste ${runId}`)
    expect(created.progressoes.length).toBe(1)

    await repository.create({
      nome: `Bruno Teste ${runId}`,
      matricula: `M${runId}02`,
      email: `bruno.teste.${runId}@example.com`,
      ativo: false,
    })

    const listed = await repository.list({
      page: 1,
      pageSize: 10,
      nome: runId,
      ativo: true,
      sortBy: 'nome',
      sortOrder: 'asc',
    })
    expect(listed.items.length).toBe(1)
    expect(listed.items[0].nome).toBe(`Ana Teste ${runId}`)

    const listedAll = await repository.listAll({ nome: runId, ativo: undefined }, 'nome', 'asc')
    expect(listedAll.length).toBe(2)

    const byId = await repository.findById(created.id)
    expect(byId?.email).toBe(`ana.teste.${runId}@example.com`)

    const conflictByEmail = await repository.findConflict({
      email: `ana.teste.${runId}@example.com`,
      ignoreId: created.id,
    })
    expect(conflictByEmail).toBeNull()

    const realConflictByEmail = await repository.findConflict({
      email: `ana.teste.${runId}@example.com`,
    })
    expect(realConflictByEmail?.id).toBe(created.id)

    const updated = await repository.update(created.id, {
      nome: 'Ana Atualizada',
      ativo: false,
    })
    expect(updated.nome).toBe('Ana Atualizada')
    expect(updated.ativo).toBe(false)

    await repository.delete(created.id)
    const removed = await repository.findById(created.id)
    expect(removed).toBeNull()

    await prisma.docente.deleteMany({
      where: {
        OR: [
          { matricula: `M${runId}01` },
          { matricula: `M${runId}02` },
          { email: `ana.teste.${runId}@example.com` },
          { email: `bruno.teste.${runId}@example.com` },
        ],
      },
    })
  })
})
