import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const args = new Set(process.argv.slice(2))
const apply = args.has('--apply')
const verify = args.has('--verify')
const fixturePath = resolve('from-cms/fixtures/products.json')
const products = JSON.parse(readFileSync(fixturePath, 'utf8'))

// Ten historyczny oryginał został zastąpiony nowym uploadem UUID. Jawny override
// utrzymuje mock na istniejącym obiekcie zamiast publikować fallback 404.
const originalOverrides = new Map([
  [
    '47:0',
    'https://cdn.camalio.pl/products/rolex-day-date-platinum/41265376-e639-4f17-bf54-cbb384db582a.jpg',
  ],
])

const candidates = []
for (const product of products) {
  if (!Array.isArray(product.images) || product.images.length === 0) continue
  const existingByOriginal = new Map(
    (product.imageAssets ?? []).map((asset) => [asset.original, asset]),
  )

  product.imageAssets = product.images.map((path, index) => {
    const original =
      originalOverrides.get(`${product.id}:${index}`) ??
      new URL(path, 'https://cdn.camalio.pl').toString()
    const existing = existingByOriginal.get(original)
    const thumb = variantUrl(original, 'thumb')
    const medium = variantUrl(original, 'medium')
    const asset = {
      original,
      thumb,
      medium,
      alt: existing?.alt?.trim() || imageAlt(product, path, index),
    }
    candidates.push(asset.original, asset.thumb, asset.medium)
    return asset
  })
}

if (verify) {
  const failures = await verifyUrls(candidates)
  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`[fixture-images] ${failure.status ?? 'ERR'} ${failure.url}`)
    }
    process.exitCode = 1
  } else {
    console.log(`[fixture-images] OK: ${candidates.length} adresów CDN odpowiada poprawnie.`)
  }
}

if (!apply) {
  console.log(
    `[fixture-images] Preview: ${products.length} produktów. Dodaj --apply, aby zapisać jawne imageAssets.`,
  )
} else if (!process.exitCode) {
  writeFileSync(fixturePath, `${JSON.stringify(products, null, 2)}\n`, 'utf8')
  console.log(`[fixture-images] Zapisano ${fixturePath}.`)
}

function variantUrl(original, variant) {
  const parsed = new URL(original)
  const match = parsed.pathname.match(/^(.*\/)([^/]+)\.(?:jpe?g|png|webp)$/i)
  if (!match) throw new Error(`Nieobsługiwany URL obrazu: ${original}`)
  parsed.pathname = `${match[1]}_variants/${match[2]}-${variant}.webp`
  return parsed.toString()
}

function imageAlt(product, path, index) {
  const stem = path.split('/').at(-1)?.replace(/\.[^.]+$/, '').toLowerCase()
  const angle = {
    front: 'przód',
    left: 'lewy profil',
    lewo: 'lewy profil',
    'bardziej-lewo': 'dalszy lewy profil',
    'front-lewo': 'przód i lewy profil',
    right: 'prawy profil',
    prawo: 'prawy profil',
    'little-right': 'lekki prawy profil',
    back: 'tył',
    tyl: 'tył',
  }[stem]
  return `${product.brand} ${product.name} — ${angle ?? `zdjęcie ${index + 1}`}`
}

async function verifyUrls(urls) {
  const unique = [...new Set(urls)]
  const failures = []
  let cursor = 0

  async function worker() {
    while (cursor < unique.length) {
      const url = unique[cursor]
      cursor += 1
      try {
        const response = await fetch(url, { method: 'HEAD' })
        if (!response.ok) failures.push({ url, status: response.status })
      } catch {
        failures.push({ url })
      }
    }
  }

  await Promise.all(Array.from({ length: 16 }, worker))
  return failures
}
