import type { Sessao, Usuario } from '@prisma/client'

export type AuthenticatedSession = Sessao & {
  usuario: Pick<Usuario, 'id' | 'login' | 'nome' | 'ativo'>
}

export type AuthenticatedUser = AuthenticatedSession['usuario']

export type SessionRequestMetadata = {
  ip?: string | null
  userAgent?: string | null
}
