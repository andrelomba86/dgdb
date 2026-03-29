import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const normalizeLogin = login => login.trim().toLowerCase()

async function run() {
  const login = normalizeLogin(process.env.ADMIN_LOGIN ?? 'admin')
  const plainPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!'

  const passwordHash = await bcrypt.hash(plainPassword, 12)

  await prisma.usuario.upsert({
    where: { login },
    update: {
      nome: 'Administrador',
      senhaHash: passwordHash,
      ativo: true,
    },
    create: {
      login,
      nome: 'Administrador',
      senhaHash: passwordHash,
      ativo: true,
    },
  })

  await prisma.sessao.deleteMany({
    where: {
      expiraEm: {
        lte: new Date(),
      },
    },
  })

  console.log('Seed concluido. Admin provisionado com sucesso.')
}

run()
  .catch(error => {
    console.error('Erro ao executar seed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
