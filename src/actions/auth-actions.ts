'use server'

import { redirect } from 'next/navigation'

import { ForbiddenError, UnauthorizedError } from '@/lib/errors'
import { assertSameOriginRequest } from '@/lib/csrf'
import {
  clearSessionCookie,
  getSessionTokenFromCookie,
  readRequestMetadata,
  setSessionCookie,
} from '@/lib/session'
import { authService } from '@/services/auth-service'
import { loginInputSchema } from '@/validators/auth'

const LOGIN_ERROR_QUERY_PARAM = 'erro=Credenciais%20inv%C3%A1lidas'
const LOGIN_FORBIDDEN_QUERY_PARAM = 'erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida'

export const loginAction = async (formData: FormData) => {
  try {
    await assertSameOriginRequest()

    const parsed = loginInputSchema.safeParse({
      login: formData.get('login'),
      senha: formData.get('senha'),
    })

    if (!parsed.success) {
      redirect(`/login?${LOGIN_ERROR_QUERY_PARAM}`)
    }

    const metadata = await readRequestMetadata()
    const { token, session } = await authService.login(parsed.data, metadata)

    await setSessionCookie(token, session.expiraEm)
  } catch (error) {
    if (error instanceof ForbiddenError) {
      redirect(`/login?${LOGIN_FORBIDDEN_QUERY_PARAM}`)
    }

    if (error instanceof UnauthorizedError) {
      redirect(`/login?${LOGIN_ERROR_QUERY_PARAM}`)
    }

    throw error
  }

  redirect('/')
}

export const logoutAction = async () => {
  try {
    await assertSameOriginRequest()

    const token = await getSessionTokenFromCookie()

    if (token) {
      await authService.logout(token)
    }

    await clearSessionCookie()
    redirect('/login')
  } catch (error) {
    if (error instanceof ForbiddenError) {
      redirect('/login?erro=Requisi%C3%A7%C3%A3o%20inv%C3%A1lida')
    }

    throw error
  }
}
