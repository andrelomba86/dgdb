import { redirect } from 'next/navigation'

import { authService } from '@/services/auth-service'
import type { AuthenticatedUser } from '@/types/auth'

import { getSessionTokenFromCookie } from './session'

export const getAuthenticatedUser = async (): Promise<AuthenticatedUser | null> => {
  const token = await getSessionTokenFromCookie()

  if (!token) {
    return null
  }

  const session = await authService.validateSession(token)

  if (!session) {
    // Não limpar o cookie aqui, pois pode não estar em Server Action/Route Handler
    return null
  }

  return session.usuario
}

export const requireAuthenticatedUser = async (): Promise<AuthenticatedUser> => {
  const user = await getAuthenticatedUser()

  if (!user) {
    redirect('/login')
  }

  return user
}