import { z } from 'zod'

const toTrimmedString = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }

  return value.trim()
}

const toNullableTrimmedString = (value: unknown) => {
  if (value == null) {
    return null
  }

  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const toOptionalTrimmedString = (value: unknown) => {
  if (value == null) {
    return undefined
  }

  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const toDate = (value: unknown) => {
  console.log('Value being processed by toDate:', value)
  if (value == null || value === '') {
    return value
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value === 'string') {
    return new Date(value)
  }

  return value
}

export const positiveIntSchema = z.number().int().positive()

export const idSchema = z.coerce.number().int().positive()

export const requiredString = (label: string, maxLength: number) =>
  z.preprocess(
    toTrimmedString,
    z
      .string({ required_error: `${label} é obrigatório.` })
      .min(1, `${label} é obrigatório.`)
      .max(maxLength, `${label} deve ter no máximo ${maxLength} caracteres.`),
  )

export const requiredMinString = (label: string, minLength: number, maxLength: number) =>
  z.preprocess(
    toTrimmedString,
    z
      .string({ required_error: `${label} é obrigatório.` })
      .min(minLength, `${label} deve ter pelo menos ${minLength} caracteres.`)
      .max(maxLength, `${label} deve ter no máximo ${maxLength} caracteres.`),
  )

export const email = (label: string, maxLength: number) =>
  z.preprocess(
    toTrimmedString,
    z
      .string({ required_error: `${label} é obrigatório.` })
      .min(1, `${label} é obrigatório.`)
      .max(maxLength, `${label} deve ter no máximo ${maxLength} caracteres.`)
      .email(`${label} inválido.`),
  )

export const requiredPatternString = (
  label: string,
  maxLength: number,
  pattern: RegExp,
  invalidMessage: string,
) =>
  z.preprocess(
    toTrimmedString,
    z
      .string({ required_error: `${label} é obrigatório.` })
      .min(1, `${label} é obrigatório.`)
      .max(maxLength, `${label} deve ter no máximo ${maxLength} caracteres.`)
      .regex(pattern, invalidMessage),
  )

export const optionalString = (maxLength: number) =>
  z.preprocess(
    toOptionalTrimmedString,
    z.string().max(maxLength, `O valor deve ter no máximo ${maxLength} caracteres.`).optional(),
  )

export const nullableString = (maxLength: number) =>
  z.preprocess(
    toNullableTrimmedString,
    z.union([
      z
        .string()
        .min(1, 'O valor não pode ser vazio.')
        .max(maxLength, `O valor deve ter no máximo ${maxLength} caracteres.`),
      z.null(),
    ]),
  )

export const requiredDate = (label: string) =>
  z.preprocess(
    toDate,
    z.date({ required_error: `${label} é obrigatória.`, invalid_type_error: `${label} é inválida.` }),
  )

export const nullableDate = z.preprocess(toDate, z.union([z.date(), z.null()]))

export const pageSchema = z.coerce.number().int().min(1).default(1)

export const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(10)
