import { HttpRequest } from '@/app/services/HttpRequest'
import { ServiceError } from '@/app/services/errors/ServiceError'

// Mock global fetch
//  const globalAny = global

describe('HttpRequest', () => {
  let httpRequest: HttpRequest

  beforeEach(() => {
    httpRequest = new HttpRequest()
  })

  it('should return parsed JSON on successful fetch', async () => {
    const mockData = { message: 'Success' }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const result = await httpRequest.fetch<typeof mockData>('https://api.url/test')
    expect(result).toEqual(mockData)
  })

  it('should throw ServiceError on failed fetch with known error', async () => {
    const errorMessage = 'Something went wrong'
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: errorMessage }),
    })
    // console.log(await httpRequest.fetch('https://invalid.url.test'))
    await expect(httpRequest.fetch('https://api.url/test')).rejects.toThrow(ServiceError)
    await expect(httpRequest.fetch('https://api.url/test')).rejects.toThrow(errorMessage)
  })

  it('should throw ServiceError on failed fetch with no error object', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    })

    // await expect(httpRequest.fetch('https://api.url/test')).rejects.toThrow(HttpRequest)
    await expect(httpRequest.fetch('https://api.url/test')).rejects.toThrow(ServiceError)
  })

  it('should handle unexpected errors and wrap them in a ServiceError', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Unexpected network error'))

    await expect(httpRequest.fetch('https://api.url/test')).rejects.toThrow(ServiceError)
  })
})
