import { headers } from 'next/headers'

import { ForbiddenError } from '@/lib/errors'

function parseHostFromUrl(value: string | null) {
  if (!value) {
    return null
  }

  try {
    return new URL(value).host
  } catch {
    return null
  }
}

export async function assertSameOriginRequest() {
  const headerStore = await headers()
  const requestHost = headerStore.get('x-forwarded-host') ?? headerStore.get('host')

  if (!requestHost) {
    throw new ForbiddenError('Requisição sem host válido.')
  }

  const normalizedRequestHost = requestHost.split(',')[0]?.trim()
  const originHost = parseHostFromUrl(headerStore.get('origin'))
  const refererHost = parseHostFromUrl(headerStore.get('referer'))

  if (originHost === normalizedRequestHost || refererHost === normalizedRequestHost) {
    return
  }

  throw new ForbiddenError('Origem da requisição não autorizada.')
}
