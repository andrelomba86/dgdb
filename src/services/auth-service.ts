import bcrypt from 'bcrypt'

import { UnauthorizedError } from '@/lib/errors'
import { createSessionToken, getSessionExpirationDate, hashSessionToken } from '@/lib/session'
import { authRepository, type AuthRepository } from '@/repositories/auth-repository'
import type { AuthenticatedSession, SessionRequestMetadata } from '@/types/auth'
import type { LoginInput } from '@/validators/auth'

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  async login(
    input: LoginInput,
    metadata: SessionRequestMetadata,
  ): Promise<{ token: string; session: AuthenticatedSession }> {
    const login = input.login.trim().toLowerCase()
    const user = await this.repository.findUserByLogin(login)
    if (!user || !user.ativo) {
      throw new UnauthorizedError('Credenciais inválidas.')
    }

    const isValidPassword = await bcrypt.compare(input.senha, user.senhaHash)

    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciais inválidas.')
    }

    const token = createSessionToken()
    const tokenHash = hashSessionToken(token)
    const expiresAt = getSessionExpirationDate()

    const session = await this.repository.createSession({
      tokenHash,
      usuarioId: user.id,
      expiraEm: expiresAt,
      metadata,
    })

    return { token, session }
  }

  async validateSession(token: string): Promise<AuthenticatedSession | null> {
    const tokenHash = hashSessionToken(token)
    return this.repository.findValidSessionByTokenHash(tokenHash)
  }

  async logout(token: string) {
    const tokenHash = hashSessionToken(token)
    await this.repository.deleteSessionByTokenHash(tokenHash)
  }

  async cleanupExpiredSessions() {
    await this.repository.deleteExpiredSessions()
  }
}

export const authService = new AuthService()
