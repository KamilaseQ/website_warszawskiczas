import { readFile } from 'node:fs/promises'

const PRODUCTION_ORIGIN = 'https://warszawskiczas.pl'
const DEFAULT_BASE_URL = process.env.CHECK_BASE_URL || 'http://localhost:3000'
const DEFAULT_SCOPE = 'all'

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

const baseUrl = argument('base-url', DEFAULT_BASE_URL).replace(/\/$/, '')
const scope = argument('scope', DEFAULT_SCOPE)
const reportOnly = process.argv.includes('--report')
const validScopes = new Set(['all', 'seo', 'links', 'images', 'products'])

if (!validScopes.has(scope)) {
  throw new Error(`[seo-audit] Unknown scope "${scope}". Use: ${[...validScopes].join(', ')}`)
}

const knownIssues = JSON.parse(
  await readFile(new URL('./seo-audit-known-issues.json', import.meta.url), 'utf8'),
)
const auditPolicy = JSON.parse(
  await readFile(new URL('./seo-audit-policy.json', import.meta.url), 'utf8'),
)

function normalizePath(value) {
  const url = value instanceof URL ? value : new URL(value, PRODUCTION_ORIGIN)
  let pathname = url.pathname
  try {
    pathname = decodeURIComponent(pathname)
  } catch {
    // Keep the encoded path. A separate URL validation will expose malformed URLs.
  }
  return pathname !== '/' ? pathname.replace(/\/$/, '') : '/'
}

function normalizeUrl(value) {
  const url = new URL(value, PRODUCTION_ORIGIN)
  const path = normalizePath(url)
  return `${url.origin}${path === '/' ? '' : encodeURI(path)}`
}

function localUrl(productionUrl) {
  const url = new URL(productionUrl)
  return `${baseUrl}${url.pathname}${url.search}`
}

function decodeEntities(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function parseAttributes(tag) {
  const attributes = {}
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  let match
  while ((match = pattern.exec(tag))) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match
    attributes[name.toLowerCase()] = decodeEntities(doubleQuoted ?? singleQuoted ?? unquoted ?? '')
  }
  return attributes
}

function tags(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>`, 'gi')
  return [...html.matchAll(pattern)].map((match) => ({
    raw: match[0],
    attrs: parseAttributes(match[0]),
  }))
}

function elementText(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi')
  return [...html.matchAll(pattern)].map((match) => decodeEntities(match[1].replace(/<[^>]+>/g, '').trim()))
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => decodeEntities(match[1].trim()))
}

function sitemapImageLocations(xml) {
  return [...xml.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/gi)].map((match) => decodeEntities(match[1].trim()))
}

function duplicates(values) {
  const seen = new Set()
  const repeated = new Set()
  for (const value of values) {
    if (seen.has(value)) repeated.add(value)
    seen.add(value)
  }
  return [...repeated]
}

async function fetchText(url, expectedType) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'WarszawskiCzas-Local-Seo-Audit/1.0' },
    redirect: 'manual',
  })
  const contentType = response.headers.get('content-type') || ''
  const body = await response.text()
  return {
    url,
    status: response.status,
    location: response.headers.get('location'),
    contentType,
    typeMatches: !expectedType || contentType.includes(expectedType),
    body,
  }
}

async function mapConcurrent(values, limit, mapper) {
  const results = new Array(values.length)
  let cursor = 0
  async function worker() {
    while (cursor < values.length) {
      const index = cursor++
      results[index] = await mapper(values[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, worker))
  return results
}

function inspectPage(productionUrl, response) {
  const html = response.body
  const links = tags(html, 'link')
  const metas = tags(html, 'meta')
  const anchors = tags(html, 'a')
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  const canonicals = links
    .filter(({ attrs }) => (attrs.rel || '').toLowerCase().split(/\s+/).includes('canonical'))
    .map(({ attrs }) => attrs.href)
    .filter(Boolean)
  const alternates = links
    .filter(({ attrs }) => (attrs.rel || '').toLowerCase().split(/\s+/).includes('alternate') && attrs.hreflang)
    .map(({ attrs }) => ({ hreflang: attrs.hreflang.toLowerCase(), href: attrs.href }))
    .filter(({ href }) => Boolean(href))
  const descriptions = metas
    .filter(({ attrs }) => (attrs.name || '').toLowerCase() === 'description')
    .map(({ attrs }) => attrs.content || '')
  const robots = metas
    .filter(({ attrs }) => ['robots', 'googlebot'].includes((attrs.name || '').toLowerCase()))
    .map(({ attrs }) => (attrs.content || '').toLowerCase())
  const internalLinks = []
  const languageLinks = []
  for (const { attrs } of anchors) {
    const href = attrs.href
    if (!href || href.startsWith('#') || /^(?:mailto:|tel:|sms:|javascript:)/i.test(href)) continue
    try {
      const url = new URL(href, productionUrl)
      if (url.origin === PRODUCTION_ORIGIN) {
        internalLinks.push(normalizePath(url))
        if (attrs.hreflang) {
          languageLinks.push({
            hreflang: attrs.hreflang.toLowerCase(),
            lang: (attrs.lang || '').toLowerCase(),
            path: normalizePath(url),
          })
        }
      }
    } catch {
      // Invalid href is reported by the page-level URL checks below.
    }
  }
  const jsonLdErrors = []
  for (const match of scripts) {
    const attrs = parseAttributes(match[1])
    if ((attrs.type || '').toLowerCase() !== 'application/ld+json') continue
    try {
      JSON.parse(decodeEntities(match[2].trim()))
    } catch (error) {
      jsonLdErrors.push(error instanceof Error ? error.message : String(error))
    }
  }
  const imageUrls = []
  for (const { attrs } of tags(html, 'img')) {
    if (attrs.src) imageUrls.push({ kind: 'img', url: attrs.src })
    if (attrs.srcset) {
      for (const entry of attrs.srcset.split(',')) {
        const candidate = entry.trim().split(/\s+/)[0]
        if (candidate) imageUrls.push({ kind: 'img-srcset', url: candidate })
      }
    }
  }
  for (const { attrs } of metas) {
    const property = (attrs.property || attrs.name || '').toLowerCase()
    if (['og:image', 'og:image:url', 'twitter:image'].includes(property) && attrs.content) {
      imageUrls.push({ kind: property, url: attrs.content })
    }
  }

  return {
    productionUrl,
    path: normalizePath(productionUrl),
    response,
    titles: elementText(html, 'title'),
    descriptions,
    canonicals,
    alternates,
    h1Count: tags(html, 'h1').length,
    noindex: robots.some((value) => value.split(',').map((item) => item.trim()).includes('noindex')),
    internalLinks: [...new Set(internalLinks)],
    languageLinks,
    jsonLdErrors,
    imageUrls,
  }
}

function localeForPath(path) {
  if (path === '/en' || path.startsWith('/en/')) return 'en'
  if (path === '/ua' || path.startsWith('/ua/')) return 'ua'
  return 'pl'
}

function productLocale(path) {
  if (path.startsWith('/en/products/')) return 'en'
  if (path.startsWith('/ua/каталог/')) return 'ua'
  if (path.startsWith('/produkty/')) return 'pl'
  return null
}

function malformedImageUrl(value) {
  const decoded = decodeEntities(value)
  if (/warszawskiczas\.plhttps(?::|%3a)?/i.test(decoded)) return true
  if (/^https?:\/\/[^/]+\/https(?::|%3a)?\/\//i.test(decoded)) return true
  try {
    const url = new URL(decoded, PRODUCTION_ORIGIN)
    return !['http:', 'https:'].includes(url.protocol)
  } catch {
    return true
  }
}

function addIssue(issues, type, data) {
  issues.push({ type, ...data })
}

function expectedKnownIssue(issue) {
  if (issue.type === 'canonical-mismatch') return knownIssues.canonicalMismatchPaths.includes(issue.path)
  if (issue.type === 'orphan-page') return knownIssues.orphanPaths.includes(issue.path)
  if (issue.type === 'disconnected-locale-root') return knownIssues.disconnectedLocaleRoots.includes(issue.path)
  return false
}

function issueLabel(issue) {
  const subject = issue.path || issue.url || issue.hreflang || ''
  return `${issue.type}${subject ? `: ${subject}` : ''}${issue.message ? ` — ${issue.message}` : ''}`
}

const sitemapResponse = await fetchText(`${baseUrl}/sitemap.xml`, 'xml')
if (sitemapResponse.status !== 200) {
  throw new Error(`[seo-audit] ${baseUrl}/sitemap.xml returned ${sitemapResponse.status}`)
}

const sitemapUrls = sitemapLocations(sitemapResponse.body)
const sitemapImages = sitemapImageLocations(sitemapResponse.body)
const pages = await mapConcurrent(sitemapUrls, 10, async (productionUrl) =>
  inspectPage(productionUrl, await fetchText(localUrl(productionUrl), 'text/html')),
)
const pathToPage = new Map(pages.map((page) => [page.path, page]))
const sitemapPaths = new Set(pathToPage.keys())
const issues = []

if (scope === 'all' || scope === 'seo' || scope === 'products') {
  if (/<priority>/i.test(sitemapResponse.body)) addIssue(issues, 'unsupported-sitemap-priority', {})
  if (/<changefreq>/i.test(sitemapResponse.body)) addIssue(issues, 'unsupported-sitemap-changefreq', {})
  for (const match of sitemapResponse.body.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi)) {
    const value = match[1].trim()
    const timestamp = Date.parse(value)
    if (!Number.isFinite(timestamp) || timestamp > Date.now() + 86_400_000) {
      addIssue(issues, 'invalid-sitemap-lastmod', { message: value })
    }
  }
  for (const duplicate of duplicates(sitemapUrls.map(normalizeUrl))) {
    addIssue(issues, 'duplicate-sitemap-url', { url: duplicate })
  }
  for (const page of pages) {
    if (page.response.status !== 200) {
      addIssue(issues, 'sitemap-url-not-200', {
        path: page.path,
        message: `HTTP ${page.response.status}${page.response.location ? ` -> ${page.response.location}` : ''}`,
      })
      continue
    }
    if (!page.response.typeMatches) addIssue(issues, 'invalid-html-content-type', { path: page.path })
    if (page.titles.length !== 1 || !page.titles[0]) {
      addIssue(issues, 'invalid-title-count', { path: page.path, message: `found ${page.titles.length}` })
    }
    if (page.descriptions.length !== 1 || !page.descriptions[0]) {
      addIssue(issues, 'invalid-description-count', { path: page.path, message: `found ${page.descriptions.length}` })
    }
    if (page.h1Count !== 1) {
      addIssue(issues, 'invalid-h1-count', { path: page.path, message: `found ${page.h1Count}` })
    }
    if (page.noindex) addIssue(issues, 'noindex-in-sitemap', { path: page.path })
    if (page.canonicals.length !== 1) {
      addIssue(issues, 'invalid-canonical-count', { path: page.path, message: `found ${page.canonicals.length}` })
    } else if (normalizeUrl(page.canonicals[0]) !== normalizeUrl(page.productionUrl)) {
      addIssue(issues, 'canonical-mismatch', {
        path: page.path,
        message: `${page.canonicals[0]} != ${page.productionUrl}`,
      })
    }
    if (page.alternates.length !== 4) {
      addIssue(issues, 'invalid-hreflang-count', { path: page.path, message: `found ${page.alternates.length}` })
    }
    const languages = page.alternates.map(({ hreflang }) => hreflang)
    if (duplicates(languages).length) addIssue(issues, 'duplicate-hreflang', { path: page.path })
    for (const error of page.jsonLdErrors) {
      addIssue(issues, 'invalid-json-ld', { path: page.path, message: error })
    }

    const expectedLanguageTargets = page.alternates
      .filter(({ hreflang }) => hreflang !== 'x-default')
      .map(({ href }) => normalizePath(href))
      .sort()
    const switcherTargets = [...new Set(page.languageLinks.map(({ path }) => path))].sort()
    const expectedSwitcherLanguages = page.alternates
      .filter(({ hreflang }) => hreflang !== 'x-default')
      .map(({ hreflang }) => hreflang)
      .sort()
    const switcherLanguages = [...new Set(page.languageLinks.map(({ hreflang }) => hreflang))].sort()
    if (
      page.languageLinks.length < 3 ||
      expectedLanguageTargets.join('|') !== switcherTargets.join('|') ||
      expectedSwitcherLanguages.join('|') !== switcherLanguages.join('|') ||
      page.languageLinks.some(({ hreflang, lang }) => !hreflang || !lang)
    ) {
      addIssue(issues, 'invalid-language-switcher-links', {
        path: page.path,
        message: `expected ${expectedLanguageTargets.join(', ')}, found ${switcherTargets.join(', ')}`,
      })
    }
  }

  const noindexPages = await mapConcurrent(auditPolicy.noindexPaths, 6, async (path) => {
    const productionUrl = `${PRODUCTION_ORIGIN}${encodeURI(path)}`
    return inspectPage(productionUrl, await fetchText(`${baseUrl}${encodeURI(path)}`, 'text/html'))
  })
  for (const page of noindexPages) {
    if (sitemapPaths.has(page.path)) addIssue(issues, 'noindex-url-in-sitemap', { path: page.path })
    if (page.response.status !== 200) {
      addIssue(issues, 'noindex-url-not-200', { path: page.path, message: `HTTP ${page.response.status}` })
      continue
    }
    if (!page.noindex) addIssue(issues, 'missing-noindex', { path: page.path })
    if (page.canonicals.length !== 1 || normalizeUrl(page.canonicals[0]) !== normalizeUrl(page.productionUrl)) {
      addIssue(issues, 'invalid-noindex-canonical', {
        path: page.path,
        message: page.canonicals.join(', ') || 'missing',
      })
    }
    if (page.alternates.length !== 0) {
      addIssue(issues, 'hreflang-on-noindex', { path: page.path, message: `found ${page.alternates.length}` })
    }
  }

  for (const page of pages) {
    for (const alternate of page.alternates) {
      const targetPath = normalizePath(alternate.href)
      const target = pathToPage.get(targetPath)
      if (!target) {
        addIssue(issues, 'hreflang-target-outside-sitemap', {
          path: page.path,
          hreflang: alternate.hreflang,
          message: targetPath,
        })
        continue
      }
      const reciprocal = target.alternates.some(({ href }) => normalizePath(href) === page.path)
      if (!reciprocal) {
        addIssue(issues, 'non-reciprocal-hreflang', {
          path: page.path,
          hreflang: alternate.hreflang,
          message: targetPath,
        })
      }
    }
  }
}

if (scope === 'all' || scope === 'products') {
  const counts = { pl: 0, en: 0, ua: 0 }
  for (const page of pages) {
    const locale = productLocale(page.path)
    if (locale) counts[locale] += 1
  }
  for (const [locale, count] of Object.entries(counts)) {
    if (count === 0) addIssue(issues, 'missing-product-locale', { path: locale })
  }
  if (new Set(Object.values(counts)).size !== 1) {
    addIssue(issues, 'product-locale-count-mismatch', { message: JSON.stringify(counts) })
  }
}

if (scope === 'all' || scope === 'links') {
  const incoming = new Map([...sitemapPaths].map((path) => [path, new Set()]))
  for (const page of pages) {
    for (const targetPath of page.internalLinks) {
      if (targetPath !== page.path && incoming.has(targetPath)) incoming.get(targetPath).add(page.path)
    }
  }
  for (const [path, sources] of incoming) {
    if (!['/', '/en', '/ua'].includes(path) && sources.size === 0) {
      addIssue(issues, 'orphan-page', { path })
    }
  }

  const roots = ['/', '/en', '/ua']
  for (const root of roots) {
    const page = pathToPage.get(root)
    if (!page) {
      addIssue(issues, 'missing-locale-root', { path: root })
      continue
    }
    const linkedLocales = new Set(page.internalLinks.filter((path) => roots.includes(path)))
    for (const target of roots) {
      if (target !== root && !linkedLocales.has(target)) {
        addIssue(issues, 'disconnected-locale-root', { path: `${root} -> ${target}` })
      }
    }
  }

  const depth = new Map([['/', 0]])
  const queue = ['/']
  while (queue.length) {
    const current = queue.shift()
    const page = pathToPage.get(current)
    if (!page) continue
    for (const target of page.internalLinks) {
      if (!sitemapPaths.has(target) || depth.has(target)) continue
      depth.set(target, depth.get(current) + 1)
      queue.push(target)
    }
  }
  const unreachable = [...sitemapPaths].filter((path) => !depth.has(path))
  if (unreachable.length) {
    addIssue(issues, 'unreachable-from-default', {
      message: `${unreachable.length} pages; ${unreachable.slice(0, 8).join(', ')}${unreachable.length > 8 ? ', ...' : ''}`,
      count: unreachable.length,
    })
  }
  const overDepth = [...depth].filter(([, value]) => value > 3)
  if (overDepth.length) {
    addIssue(issues, 'over-depth', {
      message: `${overDepth.length} pages; ${overDepth.slice(0, 8).map(([path, value]) => `${path} (${value})`).join(', ')}`,
      count: overDepth.length,
    })
  }
}

if (scope === 'all' || scope === 'images') {
  for (const url of sitemapImages) {
    if (malformedImageUrl(url)) addIssue(issues, 'malformed-image-url', { url, message: 'sitemap image' })
  }
  for (const page of pages) {
    for (const image of page.imageUrls) {
      if (malformedImageUrl(image.url)) {
        addIssue(issues, 'malformed-image-url', {
          path: page.path,
          url: image.url,
          message: image.kind,
        })
      }
    }
  }
}

const known = []
const unexpected = []
for (const issue of issues) {
  if (expectedKnownIssue(issue)) known.push(issue)
  else unexpected.push(issue)
}

const countIssueTypes = new Map()
for (const issue of issues) countIssueTypes.set(issue.type, (countIssueTypes.get(issue.type) || 0) + 1)

const expectedCounts = {
  'non-reciprocal-hreflang': knownIssues.nonReciprocalHreflangCount,
  'unreachable-from-default': knownIssues.unreachableFromDefaultCount,
  'over-depth': knownIssues.overDepthCount,
  'malformed-image-url': knownIssues.malformedImageCount,
}
for (const [type, expected] of Object.entries(expectedCounts)) {
  const actual = type === 'unreachable-from-default' || type === 'over-depth'
    ? issues.find((issue) => issue.type === type)?.count || 0
    : countIssueTypes.get(type) || 0
  if (actual === expected) {
    for (const issue of unexpected.filter((candidate) => candidate.type === type)) known.push(issue)
  }
}
const countKnownTypes = new Set(Object.keys(expectedCounts))
const finalUnexpected = unexpected.filter((issue) => !countKnownTypes.has(issue.type))
for (const [type, expected] of Object.entries(expectedCounts)) {
  const actual = type === 'unreachable-from-default' || type === 'over-depth'
    ? issues.find((issue) => issue.type === type)?.count || 0
    : countIssueTypes.get(type) || 0
  if (actual !== expected) {
    finalUnexpected.push({ type: 'known-issue-count-changed', message: `${type}: expected ${expected}, found ${actual}` })
  }
}

const actualCanonicalKnown = new Set(issues.filter((issue) => issue.type === 'canonical-mismatch').map((issue) => issue.path))
const actualOrphanKnown = new Set(issues.filter((issue) => issue.type === 'orphan-page').map((issue) => issue.path))
const actualDisconnectedKnown = new Set(issues.filter((issue) => issue.type === 'disconnected-locale-root').map((issue) => issue.path))
for (const path of knownIssues.canonicalMismatchPaths) {
  if (!actualCanonicalKnown.has(path)) finalUnexpected.push({ type: 'stale-known-issue', path, message: 'canonical mismatch no longer exists' })
}
for (const path of knownIssues.orphanPaths) {
  if (!actualOrphanKnown.has(path)) finalUnexpected.push({ type: 'stale-known-issue', path, message: 'orphan no longer exists' })
}
for (const path of knownIssues.disconnectedLocaleRoots) {
  if (!actualDisconnectedKnown.has(path)) finalUnexpected.push({ type: 'stale-known-issue', path, message: 'locale root is now connected' })
}

console.log(
  `[seo-audit] Crawled ${pages.length} sitemap pages at ${baseUrl} ` +
    `(scope=${scope}, known=${known.length}, unexpected=${finalUnexpected.length}).`,
)

if (reportOnly) {
  const grouped = {}
  for (const issue of issues) (grouped[issue.type] ||= []).push(issue)
  for (const [type, items] of Object.entries(grouped)) {
    console.log(`\n[${type}] ${items.length}`)
    for (const issue of items.slice(0, 250)) console.log(`- ${issueLabel(issue)}`)
    if (items.length > 250) console.log(`- ... and ${items.length - 250} more`)
  }
  process.exitCode = 0
} else if (finalUnexpected.length) {
  console.error('\n[seo-audit] Unexpected issues:')
  for (const issue of finalUnexpected.slice(0, 100)) console.error(`- ${issueLabel(issue)}`)
  if (finalUnexpected.length > 100) console.error(`- ... and ${finalUnexpected.length - 100} more`)
  process.exitCode = 1
} else {
  if (known.length) {
    console.warn(`[seo-audit] ${known.length} known issue(s) remain and are pinned in seo-audit-known-issues.json.`)
  }
  console.log('[seo-audit] OK')
}
