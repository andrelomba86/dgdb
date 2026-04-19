import { describe, expect, it } from 'vitest'

import { telefoneInputSchema } from '@/validators/telefone'

describe('validators/telefone', () => {
  it('aceita telefone valido e tipo suportado', () => {
    const parsed = telefoneInputSchema.parse({
      telefone: '(11) 98765-4321',
      tipo: 'celular',
    })

    expect(parsed.telefone).toBe('(11) 98765-4321')
    expect(parsed.tipo).toBe('celular')
  })

  it('rejeita telefone invalido', () => {
    expect(() => telefoneInputSchema.parse({ telefone: '123', tipo: 'celular' })).toThrow(
      'Telefone inválido.',
    )
  })

  it('rejeita tipo fora do enum', () => {
    expect(() => telefoneInputSchema.parse({ telefone: '11999999999', tipo: 'fax' })).toThrow()
  })
})
