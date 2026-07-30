#!/usr/bin/env node

const baseUrl = argument('base-url', 'https://warszawskiczas.pl').replace(/\/$/, '')
const concurrency = Number(argument('concurrency', '8'))
const cdnHosts = new Set(
  argument('cdn-hosts', 'cdn.camalio.pl,cdn.warszawskiczas.pl')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
)
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 32) {
  throw new Error('--concurrency must be an integer from 1 to 32')
}

const sitemap = await fetchText(`${baseUrl}/sitemap.xml`)
const productPages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)]
  .map((match) => decodeEntities(match[1]))
  .filter((url) => new URL(url).pathname.startsWith('/produkty/'))
if (productPages.length === 0) {
  throw new Error('Sitemap contains no Polish product pages; refusing a false-green CDN audit')
}

const pageResults = await mapConcurrent(productPages, concurrency, async (url) => {
  const html = await fetchText(url)
  const referencedUrls = new Set()
  const renderedUrls = new Set()

  for (const tag of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = attribute(tag[0], 'src')
    if (src) {
      addCdnUrl(referencedUrls, src)
      addCdnUrl(renderedUrls, src)
    }
  }
  for (const match of html.matchAll(/https:\/\/[^"'<\s\\]+/gi)) {
    addCdnUrl(referencedUrls, match[0])
  }

  return {
    page: url,
    referencedUrls: [...referencedUrls],
    renderedUrls: [...renderedUrls],
  }
})

const usedBy = new Map()
const renderedUsedBy = new Map()
for (const result of pageResults) {
  for (const url of result.referencedUrls) {
    const pages = usedBy.get(url) ?? []
    pages.push(result.page)
    usedBy.set(url, pages)
  }
  for (const url of result.renderedUrls) {
    const pages = renderedUsedBy.get(url) ?? []
    pages.push(result.page)
    renderedUsedBy.set(url, pages)
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
      contentLength: Number(response.headers.get('content-length') ?? 0),
    }
  } catch (error) {
    return {
      url,
      status: 0,
      contentType: '',
      cacheControl: '',
      contentLength: 0,
      error: String(error),
    }
  }
})
if (checks.length === 0) {
  throw new Error('Product pages exposed no supported CDN URLs; check the snapshot and CDN host')
}

const failures = checks.filter(
  (item) => item.status !== 200 || !item.contentType.toLowerCase().startsWith('image/'),
)
const originals = checks.filter((item) => !item.url.includes('/_variants/'))
const variants = checks.filter((item) => item.url.includes('/_variants/'))
const renderedChecks = checks.filter((item) => renderedUsedBy.has(item.url))
const renderedOriginals = renderedChecks.filter((item) => !item.url.includes('/_variants/'))
const renderedFailures = failures.filter((item) => renderedUsedBy.has(item.url))
const missingImmutableCache = variants.filter(
  (item) =>
    item.status === 200 &&
    (!/\bmax-age=31536000\b/i.test(item.cacheControl) || !/\bimmutable\b/i.test(item.cacheControl)),
)
const oversizedVariants = variants.filter((item) => {
  if (item.status !== 200 || item.contentLength <= 0) return false
  const limit = item.url.endsWith('-thumb.webp') ? 200 * 1024 : 600 * 1024
  return item.contentLength > limit
})
const measuredVariantSizes = variants
  .filter((item) => item.status === 200 && item.contentLength > 0)
  .map((item) => item.contentLength)
  .sort((a, b) => a - b)

console.log(`Product pages: ${productPages.length}`)
console.log(`Referenced CDN images: ${checks.length} (${originals.length} originals, ${variants.length} variants)`)
console.log(
  `Rendered CDN images: ${renderedChecks.length} (${renderedOriginals.length} originals, ${renderedChecks.length - renderedOriginals.length} variants)`,
)
console.log(`Rendered originals (must be 0): ${renderedOriginals.length}`)
console.log(`Available images: ${checks.length - failures.length}`)
console.log(`Failures: ${failures.length}`)
console.log(`Rendered failures: ${renderedFailures.length}`)
console.log(`Variants without immutable one-year cache: ${missingImmutableCache.length}`)
console.log(`Oversized variants: ${oversizedVariants.length}`)
if (measuredVariantSizes.length) {
  console.log(
    `Variant size: p50 ${formatBytes(percentile(measuredVariantSizes, 0.5))}, p95 ${formatBytes(percentile(measuredVariantSizes, 0.95))}, max ${formatBytes(measuredVariantSizes.at(-1))}`,
  )
}

for (const item of failures) {
  const page = usedBy.get(item.url)?.[0]
  console.error(`${item.status || 'network'} ${item.url}${page ? ` (used by ${page})` : ''}`)
}
for (const item of missingImmutableCache) {
  console.error(`cache ${item.url} (${item.cacheControl || 'missing Cache-Control'})`)
}
for (const item of oversizedVariants) {
  console.error(`large ${item.contentLength} B ${item.url}`)
}
for (const item of renderedOriginals) {
  const page = renderedUsedBy.get(item.url)?.[0]
  console.error(`rendered-original ${item.url}${page ? ` (used by ${page})` : ''}`)
}

if (
  failures.length ||
  missingImmutableCache.length ||
  oversizedVariants.length ||
  renderedOriginals.length
) {
  process.exitCode = 1
}

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
    if (url.protocol === 'https:' && cdnHosts.has(url.hostname.toLowerCase())) {
      target.add(url.href)
    }
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

function percentile(sortedValues, fraction) {
  const index = Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * fraction))
  return sortedValues[index]
}

function formatBytes(value) {
  if (!Number.isFinite(value)) return 'n/a'
  if (value < 1024) return `${value} B`
  return `${(value / 1024).toFixed(1)} KiB`
}
