import { ServiceError } from './errors/ServiceError'

export class HttpRequest {
  async fetch<T>(url: string, init?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, init)
      const result = await response.json()

      if (!response.ok) {
        throw new ServiceError(result.error || 'Request failed', response.status)
      }

      return result
    } catch (error) {
      const method = init?.method ?? 'GET'
      throw this.handleError(error, `${method} ${url}`)
    }
  }

  handleError(error: unknown, context: string): ServiceError {
    if (error instanceof ServiceError) {
      return error
    }

    console.error(`Error in ${context}:`, error)
    return new ServiceError(`Request failed: ${context}`, undefined, error)
  }
}
