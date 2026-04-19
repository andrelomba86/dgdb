import { describe, expect, it } from 'vitest'

import { progressaoInputSchema, progressaoPatchSchema } from '@/validators/progressao'

describe('validators/progressao', () => {
  it('aceita progressao valida com data obrigatoria', () => {
    const parsed = progressaoInputSchema.parse({
      funcao: 'Professor',
      dataInicio: '2025-01-01',
      referencia: 'A1',
    })

    expect(parsed.funcao).toBe('Professor')
    expect(parsed.dataInicio).toBeInstanceOf(Date)
    expect(parsed.referencia).toBe('A1')
  })

  it('rejeita dataInicio ausente em create', () => {
    expect(() => progressaoInputSchema.parse({ funcao: 'Professor', dataInicio: '' })).toThrow(
      'Data de início é inválida.',
    )
  })

  it('aceita dataInicio nula no patch', () => {
    const parsed = progressaoPatchSchema.parse({
      dataInicio: null,
      funcao: null,
      referencia: null,
    })

    expect(parsed.dataInicio).toBeNull()
  })
})
