import mysql from 'mysql2/promise'

class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 segundo

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function conectarDB(retryCount = 0) {
  try {
    // Validar variáveis de ambiente
    if (!process.env.DB_HOST || !process.env.DB_USER) {
      throw new DatabaseError('Configurações de banco de dados incompletas')
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'dg',
      connectTimeout: 10000, // 10 segundos
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    })

    await connection.connect()
    return connection
  } catch (error) {
    if (error.code === 'EAI_AGAIN' && retryCount < MAX_RETRIES) {
      console.log(`Tentativa ${retryCount + 1} de ${MAX_RETRIES} falhou, tentando novamente...`)
      await wait(RETRY_DELAY)
      return conectarDB(retryCount + 1)
    }

    console.error('Erro ao conectar ao banco de dados:', error)
    throw new DatabaseError(
      error.code === 'EAI_AGAIN'
        ? 'Erro de resolução DNS. Verifique sua conexão com a internet e o endereço do host.'
        : error instanceof Error
        ? error.message
        : 'Erro desconhecido na conexão'
    )
  }
}
