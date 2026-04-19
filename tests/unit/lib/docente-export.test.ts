import { describe, expect, it } from 'vitest'

import { buildDocentesCsvExport, buildDocentesPdfExport } from '@/lib/docente-export'
import type { DocenteAggregate } from '@/types/docente'

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
  }).format(value)

const createDocente = (): DocenteAggregate => ({
  id: 7,
  nome: 'Maria "M" Souza',
  endereco: null,
  dataNascimento: new Date('1990-05-20T00:00:00.000Z'),
  matricula: 'MAT-100',
  email: 'maria@example.com',
  dataAdmissao: new Date('2024-01-02T00:00:00.000Z'),
  regimeJuridico: null,
  regimeTrabalho: '40h',
  regimeDataAplicacao: null,
  ativo: true,
  progressoes: [
    {
      id: 1,
      docenteId: 7,
      funcao: 'Professora titular',
      dataInicio: new Date('2024-01-01T00:00:00.000Z'),
      dataTermino: null,
      referencia: 'A1',
    },
  ],
  telefones: [
    {
      id: 1,
      docenteId: 7,
      tipo: 'celular',
      telefone: '(11)99999-9999',
    },
  ],
  documentos: [
    {
      id: 1,
      docenteId: 7,
      tipo: 'CPF',
      documento: '12345678900',
    },
  ],
  contasBancarias: [
    {
      id: 1,
      docenteId: 7,
      banco: '001',
      agencia: '1234',
      conta: '778899',
    },
  ],
})

describe('lib/docente-export', () => {
  it('gera CSV com BOM, escape de aspas e relacoes concatenadas', () => {
    const payload = buildDocentesCsvExport([createDocente()])

    expect(payload.encoding).toBe('utf-8')
    expect(payload.mimeType).toBe('text/csv;charset=utf-8')
    expect(payload.filename).toMatch(/^docentes-\d{4}-\d{2}-\d{2}\.csv$/)
    expect(payload.content.startsWith('\uFEFF')).toBe(true)

    expect(payload.content).toContain('"Maria ""M"" Souza"')
    expect(payload.content).toContain(`"${formatDate(new Date('2024-01-02T00:00:00.000Z'))}"`)
    expect(payload.content).toContain('"Professora titular / A1 / 01/01/2024"')
    expect(payload.content).toContain('"celular: (11)99999-9999"')
    expect(payload.content).toContain('"CPF: 12345678900"')
    expect(payload.content).toContain('"001/1234/778899"')
  })

  it('gera PDF em base64 com metadados e bytes validos', async () => {
    const payload = await buildDocentesPdfExport([createDocente()])

    expect(payload.encoding).toBe('base64')
    expect(payload.mimeType).toBe('application/pdf')
    expect(payload.filename).toMatch(/^docentes-\d{4}-\d{2}-\d{2}\.pdf$/)
    expect(payload.content.length).toBeGreaterThan(100)

    const bytes = Buffer.from(payload.content, 'base64')
    expect(bytes.toString('ascii', 0, 4)).toBe('%PDF')
  })

  it('preenche valores nulos com campos vazios no CSV', () => {
    const payload = buildDocentesCsvExport([
      {
        ...createDocente(),
        matricula: null,
        email: null,
        endereco: null,
        dataAdmissao: null,
        progressoes: [],
        telefones: [],
        documentos: [],
        contasBancarias: [],
      },
    ])

    expect(payload.content).toContain('""')
    expect(payload.content).not.toContain('undefined')
    expect(payload.content).not.toContain('null')
  })
})
