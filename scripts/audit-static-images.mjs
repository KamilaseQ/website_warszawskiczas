import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')
const publicRoot = path.join(projectRoot, 'public')
const fixturePath = path.join(projectRoot, 'from-cms', 'fixtures', 'products.json')
const sourceRoots = ['app', 'components', 'lib'].map((directory) =>
  path.join(projectRoot, directory),
)
const maxCriticalImageBytes = 300 * 1024
const criticalImages = [
  'watch-31-v2.webp',
  'rolex-wimbledon-v2.webp',
  'patek-philippe-nautilus-v2.webp',
  'franck-muller-vegas4-v2.webp',
  'butikmain-v2.webp',
  'chopard-v2.webp',
  'patek-v2.webp',
  'ap-v2.webp',
]
const metadataImages = ['opengraph-image.jpg', 'twitter-image.jpg']
const retiredHeavyReferences = [
  '/watch-31.jpg',
  '/Rolex Wimbledon.jpg',
  '/Patek Philippe Nautilus-12.jpg',
  '/Franck Muller Vegas4.jpg',
  '/butikmain.jpg',
  '/chopard.jpg',
  '/patek.jpg',
  '/ap.jpg',
]
const rawOptimizedPublicReference = /['"`]\/[^'"`?#]+-v2\.webp(?:[?#][^'"`]*)?['"`]/gi
const failures = []

for (const fileName of criticalImages) {
  const info = await stat(path.join(publicRoot, fileName)).catch(() => null)
  if (!info?.isFile()) {
    failures.push(`missing optimized image: ${fileName}`)
  } else if (info.size > maxCriticalImageBytes) {
    failures.push(
      `${fileName}: ${(info.size / 1024).toFixed(1)} KiB exceeds 300 KiB critical-image budget`,
    )
  }
}

for (const fileName of metadataImages) {
  const info = await stat(path.join(projectRoot, 'app', fileName)).catch(() => null)
  if (!info?.isFile()) {
    failures.push(`missing metadata image: app/${fileName}`)
  } else if (info.size > maxCriticalImageBytes) {
    failures.push(
      `app/${fileName}: ${(info.size / 1024).toFixed(1)} KiB exceeds 300 KiB metadata-image budget`,
    )
  }
}

for (const file of await sourceFiles(sourceRoots)) {
  const source = await readFile(file, 'utf8')
  for (const match of source.matchAll(rawOptimizedPublicReference)) {
    failures.push(
      `${path.relative(projectRoot, file)} references ${match[0]} as a raw public URL; ` +
        'use STATIC_IMAGES so Hostinger serves the hashed build asset atomically',
    )
  }
  for (const retired of retiredHeavyReferences) {
    if (source.includes(retired)) {
      failures.push(`${path.relative(projectRoot, file)} still references ${retired}`)
    }
  }
  for (const match of source.matchAll(/['"`](\/[^'"`?#]+\.(?:avif|jpe?g|png|webp))(?:[?#][^'"`]*)?['"`]/gi)) {
    const relativeImagePath = decodeURIComponent(match[1]).replace(/^\//, '')
    const info =
      (await stat(path.join(publicRoot, relativeImagePath)).catch(() => null)) ??
      (await stat(path.join(projectRoot, 'app', relativeImagePath)).catch(() => null))
    if (!info?.isFile()) {
      failures.push(`${path.relative(projectRoot, file)} references missing local image ${match[1]}`)
    } else if (info.size > maxCriticalImageBytes) {
      failures.push(
        `${path.relative(projectRoot, file)} references ${match[1]} at ${(info.size / 1024).toFixed(1)} KiB`,
      )
    }
  }
}

const fixtures = JSON.parse(await readFile(fixturePath, 'utf8'))
let fixtureAssetCount = 0
for (const product of fixtures) {
  const legacyImages = Array.isArray(product.images) ? product.images : []
  const assets = Array.isArray(product.imageAssets) ? product.imageAssets : []
  if (legacyImages.length !== assets.length) {
    failures.push(
      `fixture ${product.id}: ${assets.length}/${legacyImages.length} images expose explicit imageAssets`,
    )
  }
  for (const [index, asset] of assets.entries()) {
    fixtureAssetCount += 1
    for (const field of ['original', 'thumb', 'medium']) {
      if (!isAllowedFixtureImageUrl(asset?.[field])) {
        failures.push(`fixture ${product.id} image ${index + 1}: invalid ${field} CDN URL`)
      }
    }
    if (!asset?.alt?.trim()) {
      failures.push(`fixture ${product.id} image ${index + 1}: missing alt`)
    }
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`[static-image-audit] ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `[static-image-audit] OK: ${criticalImages.length} critical WebP files, ` +
      `${metadataImages.length} metadata images, ` +
      `${fixtureAssetCount} explicit fixture assets and all referenced local images under 300 KiB`,
  )
}

function isAllowedFixtureImageUrl(value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      ['cdn.camalio.pl', 'cdn.warszawskiczas.pl'].includes(url.hostname.toLowerCase())
    )
  } catch {
    return false
  }
}

async function sourceFiles(roots) {
  const output = []
  for (const root of roots) {
    const entries = await readdir(root, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(root, entry.name)
      if (entry.isDirectory()) {
        output.push(...(await sourceFiles([fullPath])))
      } else if (entry.isFile() && /\.(?:js|mjs|ts|tsx)$/.test(entry.name)) {
        output.push(fullPath)
      }
    }
  }
  return output
}
