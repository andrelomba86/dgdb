import fs from 'fs'
import path from 'path'

const logDir = path.join(process.cwd(), 'logs')
const logPath = path.join(logDir, 'app.log')

// Garante que o diretório de logs exista
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

export function logError(message: string, error: unknownd) {
  const errorMessage = `${new Date().toISOString()} - ${message} - ${error.stack || error}\n`
  fs.appendFile(logPath, errorMessage, err => {
    if (err) console.error('Erro ao escrever log:', err)
  })
}
