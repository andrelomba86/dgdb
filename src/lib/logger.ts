import fs from 'fs'
import path from 'path'

//TODO: limitar tamanho do arquivo
const logDir = path.join(process.cwd(), 'logs')
const logPath = path.join(logDir, 'app.log')

// Garante que o diretório de logs exista
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

export function logError(message: string, error: unknown) {
  const errorMessage = `${new Date().toISOString()} - ${message} - ${(error as Error).stack || error}\n`
  fs.appendFile(logPath, errorMessage, err => {
    if (err) console.error('Erro ao escrever log:', err)
  })
}
