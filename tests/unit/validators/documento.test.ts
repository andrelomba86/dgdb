import { describe, expect, it } from 'vitest'

import { documentoInputSchema } from '@/validators/documento'

describe('validators/documento', () => {
  it('aceita documento com tipo e valor preenchidos', () => {
    const parsed = documentoInputSchema.parse({
      tipo: 'CPF',
      documento: '12345678901',
    })

    expect(parsed.tipo).toBe('CPF')
    expect(parsed.documento).toBe('12345678901')
  })

  it('rejeita campos obrigatorios vazios', () => {
    expect(() => documentoInputSchema.parse({ tipo: '  ', documento: '  ' })).toThrow()
  })
})
