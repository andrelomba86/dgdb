import { describe, expect, it } from 'vitest'

import { contaBancariaInputSchema } from '@/validators/conta-bancaria'

describe('validators/conta-bancaria', () => {
  it('aceita conta bancaria com formatos validos', () => {
    const parsed = contaBancariaInputSchema.parse({
      banco: '001',
      agencia: '1234-5',
      conta: '123456-7',
    })

    expect(parsed.banco).toBe('001')
    expect(parsed.agencia).toBe('1234-5')
    expect(parsed.conta).toBe('123456-7')
  })

  it('rejeita banco fora do padrao', () => {
    expect(() => contaBancariaInputSchema.parse({ banco: '01', agencia: '1234', conta: '123' })).toThrow(
      'Código do banco inválido.',
    )
  })

  it('rejeita agencia e conta invalidas', () => {
    expect(() => contaBancariaInputSchema.parse({ banco: '001', agencia: '@@@', conta: '123' })).toThrow(
      'Agência inválida.',
    )
    expect(() => contaBancariaInputSchema.parse({ banco: '001', agencia: '1234', conta: '@@@' })).toThrow(
      'Conta inválida.',
    )
  })
})
