import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const port = process.env.SEO_AUDIT_PORT || '3137'
const baseUrl = `http://127.0.0.1:${port}`
const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const nextBin = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
const auditScript = fileURLToPath(new URL('./seo-audit.mjs', import.meta.url))
const reportOnly = process.argv.includes('--report')

function waitForExit(child) {
  return new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => resolve({ code, signal }))
  })
}

async function waitForServer(timeoutMs = 30_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/robots.txt`)
      if (response.ok) return
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`[verify-built-site] Next.js did not start at ${baseUrl} within ${timeoutMs}ms`)
}

const server = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', port], {
  cwd: projectRoot,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverOutput = ''
server.stdout.on('data', (chunk) => { serverOutput += chunk.toString() })
server.stderr.on('data', (chunk) => { serverOutput += chunk.toString() })

try {
  await waitForServer()
  const args = [auditScript, '--base-url', baseUrl, '--scope', 'all']
  if (reportOnly) args.push('--report')
  const audit = spawn(process.execPath, args, {
    cwd: projectRoot,
    env: { ...process.env, CHECK_BASE_URL: baseUrl },
    stdio: 'inherit',
  })
  const result = await waitForExit(audit)
  if (result.code !== 0) process.exitCode = result.code || 1
} catch (error) {
  console.error(serverOutput)
  throw error
} finally {
  server.kill()
  await Promise.race([
    waitForExit(server),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ])
}
