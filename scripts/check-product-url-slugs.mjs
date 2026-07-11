const baseUrl = (process.argv[2] || process.env.CHECK_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

function duplicates(values) {
  const seen = new Set()
  const duplicated = new Set()
  for (const value of values) {
    if (seen.has(value)) duplicated.add(value)
    seen.add(value)
  }
  return [...duplicated].sort()
}

function productLocale(url) {
  if (url.includes('/en/products/')) return 'en'
  if (url.includes('/ua/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/')) return 'ua'
  if (url.includes('/produkty/')) return 'pl'
  return null
}

const res = await fetch(`${baseUrl}/sitemap.xml`)
if (!res.ok) {
  throw new Error(`[product-url-check] ${baseUrl}/sitemap.xml returned ${res.status}`)
}

const xml = await res.text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
const allDuplicates = duplicates(urls)
if (allDuplicates.length) {
  throw new Error(`[product-url-check] Duplicate sitemap URLs:\n${allDuplicates.join('\n')}`)
}

const productUrls = urls.filter((url) => productLocale(url))
const byLocale = productUrls.reduce(
  (acc, url) => {
    const locale = productLocale(url)
    if (locale) acc[locale] += 1
    return acc
  },
  { pl: 0, en: 0, ua: 0 },
)

for (const [locale, count] of Object.entries(byLocale)) {
  if (count === 0) {
    throw new Error(`[product-url-check] No ${locale} product URLs found in sitemap`)
  }
}

console.log(
  `[product-url-check] OK: ${urls.length} sitemap URLs, ${productUrls.length} product URLs ` +
    `(pl=${byLocale.pl}, en=${byLocale.en}, ua=${byLocale.ua})`,
)
