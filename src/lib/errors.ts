export class AppError extends Error {
  public readonly code: string
  public readonly status: number

  constructor(message: string, code = 'APP_ERROR', status = 500) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.status = status
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403)
  }
}
