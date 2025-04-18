export class ServiceError extends Error {
  constructor(public readonly message: string, public readonly statusCode?: number, public readonly cause?: unknown) {
    super(message)
    this.name = 'ServiceError'
  }
}
