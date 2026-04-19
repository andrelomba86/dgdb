import { describe, expect, it } from 'vitest'

import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/lib/errors'

describe('lib/errors', () => {
  it('cria AppError com defaults e subclasses com metadados corretos', () => {
    const appError = new AppError('falha inesperada')
    expect(appError.code).toBe('APP_ERROR')
    expect(appError.status).toBe(500)

    const validation = new ValidationError('dados invalidos')
    expect(validation.code).toBe('VALIDATION_ERROR')
    expect(validation.status).toBe(400)

    const conflict = new ConflictError('conflito')
    expect(conflict.code).toBe('CONFLICT')
    expect(conflict.status).toBe(409)

    const notFound = new NotFoundError('nao encontrado')
    expect(notFound.code).toBe('NOT_FOUND')
    expect(notFound.status).toBe(404)

    const unauthorized = new UnauthorizedError('sem acesso')
    expect(unauthorized.code).toBe('UNAUTHORIZED')
    expect(unauthorized.status).toBe(401)

    const forbidden = new ForbiddenError('proibido')
    expect(forbidden.code).toBe('FORBIDDEN')
    expect(forbidden.status).toBe(403)
  })
})
