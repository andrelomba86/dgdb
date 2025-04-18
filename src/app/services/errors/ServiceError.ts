export class ServiceError extends Error {
  //TODO: remover statusCode, pois não é usado
  constructor(public readonly message: string, public readonly statusCode?: number, public readonly cause?: unknown) {
    super(message)
    this.name = 'ServiceError'
  }
}
