import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const isLocalMode = process.argv.includes('--local')

const hasRuntime = () => {
  const docker = spawnSync('docker', ['info'], { stdio: 'ignore' })
  if (docker.status === 0) {
    return true
  }

  const podman = spawnSync('podman', ['info'], { stdio: 'ignore' })
  return podman.status === 0
}

if (!isLocalMode && !hasRuntime()) {
  console.log('Sem runtime de container disponível. Testes DB em container foram ignorados.')
  process.exit(0)
}

const resolveLocalDatabaseUrl = () => {
  if (process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL) {
    return process.env.DATABASE_URL ?? process.env.LOCAL_DATABASE_URL
  }

  const filePath = path.resolve(process.cwd(), '.env.test.local')
  if (!existsSync(filePath)) {
    return undefined
  }

  const content = readFileSync(filePath, 'utf8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const equalIndex = line.indexOf('=')
    if (equalIndex <= 0) {
      continue
    }

    const key = line.slice(0, equalIndex).trim()
    if (key !== 'DATABASE_URL' && key !== 'LOCAL_DATABASE_URL') {
      continue
    }

    let value = line.slice(equalIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (value.length > 0) {
      return value
    }
  }

  return undefined
}

const localDatabaseUrl = resolveLocalDatabaseUrl()

if (isLocalMode && !localDatabaseUrl) {
  console.error(
    'Defina DATABASE_URL/LOCAL_DATABASE_URL no ambiente ou em .env.test.local para executar testes DB locais.',
  )
  process.exit(1)
}

const result = spawnSync('npx', ['vitest', 'run', 'tests/integration', '--passWithNoTests'], {
  ...(localDatabaseUrl ? { DATABASE_URL: localDatabaseUrl } : {}),
  env: {
    ...process.env,
    ...(isLocalMode
      ? {
          RUN_DB_TESTS_LOCAL: '1',
          DATABASE_URL: localDatabaseUrl,
        }
      : {
          RUN_DB_TESTS: '1',
        }),
  },
  shell: true,
})

process.exit(result.status ?? 1)
