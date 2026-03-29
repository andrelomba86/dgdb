import { prisma } from '@/lib/prisma'
import type { AuthenticatedSession, SessionRequestMetadata } from '@/types/auth'

type CreateSessionParams = {
  tokenHash: string
  usuarioId: number
  expiraEm: Date
  metadata: SessionRequestMetadata
}

export class AuthRepository {
  async findUserByLogin(login: string) {
    return prisma.usuario.findUnique({
      where: { login },
    })
  }

  async createSession(params: CreateSessionParams): Promise<AuthenticatedSession> {
    const session = await prisma.sessao.create({
      data: {
        tokenHash: params.tokenHash,
        usuarioId: params.usuarioId,
        expiraEm: params.expiraEm,
        ipOrigem: params.metadata.ip ?? null,
        userAgent: params.metadata.userAgent ?? null,
      },
      include: {
        usuario: {
          select: {
            id: true,
            login: true,
            nome: true,
            ativo: true,
          },
        },
      },
    })

    return session as AuthenticatedSession
  }

  async findValidSessionByTokenHash(tokenHash: string): Promise<AuthenticatedSession | null> {
    const session = await prisma.sessao.findFirst({
      where: {
        tokenHash,
        expiraEm: {
          gt: new Date(),
        },
        usuario: {
          ativo: true,
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            login: true,
            nome: true,
            ativo: true,
          },
        },
      },
    })

    return session as AuthenticatedSession | null
  }

  async deleteSessionByTokenHash(tokenHash: string) {
    await prisma.sessao.deleteMany({
      where: { tokenHash },
    })
  }

  async deleteExpiredSessions() {
    await prisma.sessao.deleteMany({
      where: {
        expiraEm: {
          lte: new Date(),
        },
      },
    })
  }
}

export const authRepository = new AuthRepository()
