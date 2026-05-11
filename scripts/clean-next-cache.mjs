import { rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(scriptDir, '..')
const nextDir = resolve(appDir, '.next')

if (!nextDir.startsWith(appDir)) {
  throw new Error(`Refusing to remove path outside app directory: ${nextDir}`)
}

await rm(nextDir, { recursive: true, force: true })
