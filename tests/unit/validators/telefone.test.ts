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

  it('aceita tipos institucional e outro', () => {
    const parsedInstitucional = telefoneInputSchema.parse({
      telefone: '(11) 3333-4444',
      tipo: 'institucional',
    })
    const parsedOutro = telefoneInputSchema.parse({
      telefone: '(11) 98888-7777',
      tipo: 'outro',
    })

    expect(parsedInstitucional.tipo).toBe('institucional')
    expect(parsedOutro.tipo).toBe('outro')
  })

  it('rejeita telefone invalido', () => {
    expect(() => telefoneInputSchema.parse({ telefone: '123', tipo: 'celular' })).toThrow(
      'Telefone inválido.',
    )
  })

  it('aceita tipo livre e rejeita tipo vazio', () => {
    const parsed = telefoneInputSchema.parse({ telefone: '11999999999', tipo: 'fax' })

    expect(parsed.tipo).toBe('fax')
    expect(() => telefoneInputSchema.parse({ telefone: '11999999999', tipo: '   ' })).toThrow()
  })
})
