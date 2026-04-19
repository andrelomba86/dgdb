import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers'

const loadIntegrationEnvFile = () => {
  const filePath = path.resolve(process.cwd(), '.env.test.local')
  if (!existsSync(filePath)) {
    return
  }

  const allowedKeys = new Set(['DATABASE_URL', 'LOCAL_DATABASE_URL', 'RUN_DB_TESTS', 'RUN_DB_TESTS_LOCAL'])

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
    if (!allowedKeys.has(key)) {
      continue
    }

    let value = line.slice(equalIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (value.length > 0 && !process.env[key]) {
      process.env[key] = value
    }
  }
}

loadIntegrationEnvFile()

export const shouldRunDbTests = process.env.RUN_DB_TESTS === '1' || process.env.RUN_DB_TESTS_LOCAL === '1'
export const isLocalDbMode = process.env.RUN_DB_TESTS_LOCAL === '1'

const loadLocalEnvFileIfNeeded = () => {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL)
  if (hasDatabaseUrl) {
    return
  }

  const filePath = path.resolve(process.cwd(), '.env.test.local')
  if (!existsSync(filePath)) {
    return
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

    if (value.length > 0 && !process.env[key]) {
      process.env[key] = value
    }
  }
}

type DbTestContext = {
  container?: StartedTestContainer
  databaseUrl: string
}

export const setupDbTestContext = async (): Promise<DbTestContext> => {
  if (isLocalDbMode) {
    loadLocalEnvFileIfNeeded()

    const databaseUrl = process.env.DATABASE_URL ?? process.env.LOCAL_DATABASE_URL

    if (!databaseUrl) {
      throw new Error('Defina DATABASE_URL (ou LOCAL_DATABASE_URL) para executar testes DB em modo local.')
    }

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma db push --skip-generate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    })

    return { databaseUrl }
  }

  const container = await new GenericContainer('mysql:8.4')
    .withEnvironment({
      MYSQL_ROOT_PASSWORD: 'root',
      MYSQL_DATABASE: 'dgdb_test',
    })
    .withExposedPorts(3306)
    .withWaitStrategy(Wait.forLogMessage('ready for connections'))
    .start()

  const host = container.getHost()
  const port = container.getMappedPort(3306)
  const databaseUrl = `mysql://root:root@${host}:${port}/dgdb_test`
  process.env.DATABASE_URL = databaseUrl

  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  })

  return { container, databaseUrl }
}

export const teardownDbTestContext = async (context?: DbTestContext) => {
  const { prisma } = await import('@/lib/prisma')
  await prisma.$disconnect()

  if (context?.container) {
    await context.container.stop()
  }
}
