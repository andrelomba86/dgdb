import { describe, expect, it } from 'vitest'

import {
  SESSION_TTL_SECONDS,
  createSessionToken,
  getSessionExpirationDate,
  hashSessionToken,
} from '@/lib/session'

describe('Smoke', () => {
  it('valida utilitarios centrais de sessao', () => {
    const token = createSessionToken()
    const hash = hashSessionToken(token)

    expect(token).toMatch(/^[a-f0-9]{64}$/)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)

    const expiresAt = getSessionExpirationDate().getTime()
    const minExpected = Date.now() + (SESSION_TTL_SECONDS - 3) * 1000
    const maxExpected = Date.now() + (SESSION_TTL_SECONDS + 3) * 1000

    expect(expiresAt).toBeGreaterThanOrEqual(minExpected)
    expect(expiresAt).toBeLessThanOrEqual(maxExpected)
  })
})
