import { createHash, randomBytes } from 'node:crypto'

import { cookies, headers } from 'next/headers'

export const SESSION_COOKIE_NAME = 'dgdb_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 12

export const createSessionToken = () => randomBytes(32).toString('hex')

export const hashSessionToken = (token: string) => createHash('sha256').update(token).digest('hex')

export const getSessionExpirationDate = () => new Date(Date.now() + SESSION_TTL_SECONDS * 1000)

export const setSessionCookie = async (token: string, expiresAt: Date) => {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export const clearSessionCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export const getSessionTokenFromCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null
}

export const readRequestMetadata = async () => {
  const headerStore = await headers()

  return {
    ip: headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    userAgent: headerStore.get('user-agent')?.slice(0, 255) ?? null,
  }
}
