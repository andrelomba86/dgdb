import { describe, expect, it } from 'vitest'

import { loginInputSchema } from '@/validators/auth'

describe('validators/auth', () => {
  it('valida login e senha com trim no login', () => {
    const parsed = loginInputSchema.parse({ login: ' admin ', senha: '12345678' })

    expect(parsed.login).toBe('admin')
    expect(parsed.senha).toBe('12345678')
  })

  it('rejeita senha curta', () => {
    expect(() => loginInputSchema.parse({ login: 'admin', senha: '123' })).toThrow(
      'Senha deve ter pelo menos 8 caracteres.',
    )
  })
})
