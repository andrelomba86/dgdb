import mysql from 'mysql2/promise'

class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export async function conectarDB() {
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
  } catch (error: unknown) {
    console.error('Erro ao conectar ao banco de dados:', error)
    throw new DatabaseError(error instanceof Error ? error.message : 'Erro desconhecido na conexão')
  }
}
