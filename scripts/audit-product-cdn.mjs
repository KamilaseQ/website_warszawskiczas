#!/usr/bin/env node

const baseUrl = argument('base-url', 'https://warszawskiczas.pl').replace(/\/$/, '')
const concurrency = Number(argument('concurrency', '8'))
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 32) {
  throw new Error('--concurrency must be an integer from 1 to 32')
}

const sitemap = await fetchText(`${baseUrl}/sitemap.xml`)
const productPages = [...sitemap.matchAll(/<loc>([^<]+<\/loc>)/gi)]
  .map((match) => decodeEntities(match[1].replace(/<\/loc>$/i, '')))
  .filter((url) => new URL(url).pathname.startsWith('/produkty/'))

const pageResults = await mapConcurrent(productPages, concurrency, async (url) => {
  const html = await fetchText(url)
  const urls = new Set()

  for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = attribute(tag[0], 'src')
    if (src) addCdnUrl(urls, src)
  }
  for (const match of html.matchAll(/https:\/\/cdn\.camalio\.pl\/[^"'<\s\\]+/gi)) {
    addCdnUrl(urls, match[0])
  }

  return { page: url, urls: [...urls] }
})

const usedBy = new Map()
for (const result of pageResults) {
  for (const url of result.urls) {
    const pages = usedBy.get(url) ?? []
    pages.push(result.page)
    usedBy.set(url, pages)
  }
}

const checks = await mapConcurrent([...usedBy.keys()], concurrency, async (url) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { 'user-agent': 'WarszawskiCzas-CDN-Audit/1.0' },
      redirect: 'follow',
    })
    return {
      url,
      status: response.status,
      contentType: response.headers.get('content-type') ?? '',
      cacheControl: response.headers.get('cache-control') ?? '',
    }
  } catch (error) {
    return { url, status: 0, contentType: '', cacheControl: '', error: String(error) }
  }
})

const failures = checks.filter(
  (item) => item.status !== 200 || !item.contentType.toLowerCase().startsWith('image/'),
)
const originals = checks.filter((item) => !item.url.includes('/_variants/'))
const variants = checks.filter((item) => item.url.includes('/_variants/'))

console.log(`Product pages: ${productPages.length}`)
console.log(`Unique CDN images: ${checks.length} (${originals.length} originals, ${variants.length} variants)`)
console.log(`Available images: ${checks.length - failures.length}`)
console.log(`Failures: ${failures.length}`)

for (const item of failures) {
  const page = usedBy.get(item.url)?.[0]
  console.error(`${item.status || 'network'} ${item.url}${page ? ` (used by ${page})` : ''}`)
}

if (failures.length) process.exitCode = 1

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'WarszawskiCzas-CDN-Audit/1.0' },
  })
  if (!response.ok) throw new Error(`${url} returned ${response.status}`)
  return response.text()
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))
  return decodeEntities(match?.[1] ?? match?.[2] ?? '')
}

function addCdnUrl(target, value) {
  try {
    const url = new URL(value, baseUrl)
    if (url.protocol === 'https:' && url.hostname === 'cdn.camalio.pl') target.add(url.href)
  } catch {
    // Malformed URLs are covered by seo-audit; this command checks reachable CDN objects.
  }
}

function decodeEntities(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
}

async function mapConcurrent(values, limit, mapper) {
  const output = new Array(values.length)
  let cursor = 0
  async function worker() {
    while (cursor < values.length) {
      const index = cursor++
      output[index] = await mapper(values[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker))
  return output
}
