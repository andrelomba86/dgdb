import { describe, expect, it } from 'vitest'

import { PREVIOUS_ROUTE_STORAGE_KEY, getPreviousRoute, setPreviousRoute } from '@/lib/route-history'

class MemoryStorage {
  private readonly map = new Map<string, string>()

  getItem(key: string) {
    return this.map.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.map.set(key, value)
  }
}

describe('lib/route-history', () => {
  it('grava e lê rota anterior', () => {
    const storage = new MemoryStorage()

    expect(storage.getItem(PREVIOUS_ROUTE_STORAGE_KEY)).toBeNull()

    setPreviousRoute(storage, '/docentes')
    expect(getPreviousRoute(storage)).toBe('/docentes')
  })
})
