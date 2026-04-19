import { describe, expect, it } from 'vitest'

import {
  idSchema,
  nullableDate,
  nullableEmail,
  nullableString,
  optionalString,
  pageSchema,
  pageSizeSchema,
  positiveIntSchema,
  requiredDate,
  requiredMinString,
  requiredPatternString,
  requiredString,
} from '@/validators/shared'

describe('validators/shared', () => {
  it('valida positiveIntSchema e idSchema com inteiros positivos', () => {
    expect(positiveIntSchema.parse(1)).toBe(1)
    expect(idSchema.parse('10')).toBe(10)
  })

  it('rejeita inteiros invalidos em positiveIntSchema e idSchema', () => {
    expect(() => positiveIntSchema.parse(0)).toThrow()
    expect(() => idSchema.parse('-1')).toThrow()
  })

  it('requiredString faz trim e exige valor', () => {
    const schema = requiredString('Nome', 10)
    expect(schema.parse('  Ana  ')).toBe('Ana')
    expect(() => schema.parse('   ')).toThrow('Nome é obrigatório.')
    expect(() => schema.parse(123 as unknown as string)).toThrow()
  })

  it('requiredMinString aplica tamanho minimo e maximo', () => {
    const schema = requiredMinString('Senha', 8, 20)
    expect(schema.parse('12345678')).toBe('12345678')
    expect(() => schema.parse('1234')).toThrow('Senha deve ter pelo menos 8 caracteres.')
    expect(() => schema.parse('x'.repeat(21))).toThrow('Senha deve ter no máximo 20 caracteres.')
  })

  it('nullableEmail aceita null e transforma vazio em null', () => {
    const schema = nullableEmail('Email', 120)
    expect(schema.parse(null)).toBeNull()
    expect(schema.parse('   ')).toBeNull()
    expect(schema.parse('user@example.com')).toBe('user@example.com')
  })

  it('nullableEmail rejeita formato invalido', () => {
    const schema = nullableEmail('Email', 120)
    expect(() => schema.parse('invalido')).toThrow('Email inválido.')
    expect(() => schema.parse(123 as unknown as string)).toThrow()
  })

  it('requiredPatternString valida regex com trim', () => {
    const schema = requiredPatternString('Matricula', 12, /^[A-Z0-9]+$/, 'Matrícula inválida.')
    expect(schema.parse(' AB123 ')).toBe('AB123')
    expect(() => schema.parse('ab123')).toThrow('Matrícula inválida.')
  })

  it('optionalString retorna undefined para null, undefined e vazio', () => {
    const schema = optionalString(10)
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.parse(null)).toBeUndefined()
    expect(schema.parse('   ')).toBeUndefined()
    expect(schema.parse(' valor ')).toBe('valor')
    expect(() => schema.parse(123 as unknown as string)).toThrow()
  })

  it('nullableString retorna null para vazio e valida maximo', () => {
    const schema = nullableString(5)
    expect(schema.parse('   ')).toBeNull()
    expect(schema.parse(' abc ')).toBe('abc')
    expect(() => schema.parse('123456')).toThrow('O valor deve ter no máximo 5 caracteres.')
  })

  it('requiredDate aceita string e rejeita ausente', () => {
    const schema = requiredDate('Data de admissão')
    const parsed = schema.parse('2026-01-10')

    expect(parsed).toBeInstanceOf(Date)
    expect(parsed.toISOString()).toContain('2026-01-10')
    expect(() => schema.parse('')).toThrow('Data de admissão é inválida.')
  })

  it('nullableDate aceita null, string vazia e date valida', () => {
    expect(nullableDate.parse(null)).toBeNull()
    expect(nullableDate.parse('')).toBeNull()
    expect(nullableDate.parse('2026-02-01')).toBeInstanceOf(Date)
    expect(nullableDate.parse(new Date('2026-03-01'))).toBeInstanceOf(Date)
    expect(() => nullableDate.parse(123 as unknown as string)).toThrow()
  })

  it('pageSchema e pageSizeSchema aplicam defaults e limites', () => {
    expect(pageSchema.parse(undefined)).toBe(1)
    expect(pageSizeSchema.parse(undefined)).toBe(10)
    expect(() => pageSchema.parse(0)).toThrow()
    expect(() => pageSizeSchema.parse(101)).toThrow()
  })
})
