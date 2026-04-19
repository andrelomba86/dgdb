import { describe, expect, it } from 'vitest'

import {
  createDocenteSchema,
  docenteIdSchema,
  docenteListSchema,
  updateDocenteSchema,
} from '@/validators/docente'

describe('validators/docente', () => {
  it('aplica defaults e coercao no create schema', () => {
    const parsed = createDocenteSchema.parse({
      nome: '  Maria  ',
      ativo: 'on',
    })

    expect(parsed.nome).toBe('Maria')
    expect(parsed.ativo).toBe(true)
    expect(parsed.progressoes).toEqual([])
    expect(parsed.telefones).toEqual([])
    expect(parsed.documentos).toEqual([])
    expect(parsed.contasBancarias).toEqual([])
  })

  it('usa valor default de ativo como false quando ausente', () => {
    const parsed = createDocenteSchema.parse({
      nome: 'Joao',
    })

    expect(parsed.ativo).toBe(false)
  })

  it('valida update schema com id obrigatorio positivo', () => {
    const parsed = updateDocenteSchema.parse({
      id: '5',
      nome: 'Ana',
    })

    expect(parsed.id).toBe(5)
    expect(updateDocenteSchema.safeParse({ id: 0, nome: 'Ana' }).success).toBe(false)
  })

  it('valida filtros de listagem com defaults, paginacao e ordenacao', () => {
    const parsedDefault = docenteListSchema.parse({})
    expect(parsedDefault).toEqual({
      page: 1,
      pageSize: 10,
      sortBy: 'nome',
      sortOrder: 'asc',
    })

    const parsed = docenteListSchema.parse({
      page: '2',
      pageSize: '25',
      nome: '  maria  ',
      ativo: true,
      sortBy: 'dataAdmissao',
      sortOrder: 'desc',
    })

    expect(parsed.page).toBe(2)
    expect(parsed.pageSize).toBe(25)
    expect(parsed.nome).toBe('maria')
    expect(parsed.ativo).toBe(true)
    expect(parsed.sortBy).toBe('dataAdmissao')
    expect(parsed.sortOrder).toBe('desc')
  })

  it('rejeita sort invalido e parseia id de docente', () => {
    expect(docenteListSchema.safeParse({ sortBy: 'email' }).success).toBe(false)
    expect(docenteIdSchema.parse({ id: '9' })).toEqual({ id: 9 })
  })
})
