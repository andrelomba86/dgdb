import { describe, expect, it } from 'vitest'

import {
  normalizeBankCode,
  normalizeCompactValue,
  normalizeDocumentValue,
  normalizeEmail,
  normalizeOptionalText,
  normalizeText,
} from '@/lib/normalizers'

describe('lib/normalizers', () => {
  it('normaliza texto e remove espacos redundantes', () => {
    expect(normalizeText('  Ana   Paula  ')).toBe('Ana Paula')
    expect(normalizeCompactValue(' 11 99999 0000 ')).toBe('11999990000')
  })

  it('normaliza opcionais de texto e email para null quando vazio', () => {
    expect(normalizeOptionalText(undefined)).toBeNull()
    expect(normalizeOptionalText(null)).toBeNull()
    expect(normalizeOptionalText('   ')).toBeNull()
    expect(normalizeOptionalText('  CLT  ')).toBe('CLT')

    expect(normalizeEmail(undefined)).toBeNull()
    expect(normalizeEmail(null)).toBeNull()
    expect(normalizeEmail('   ')).toBeNull()
    expect(normalizeEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com')
  })

  it('normaliza documento e codigo de banco para maiusculas', () => {
    expect(normalizeDocumentValue(' ab-123 ')).toBe('AB-123')
    expect(normalizeBankCode(' ita ')).toBe('ITA')
  })
})
