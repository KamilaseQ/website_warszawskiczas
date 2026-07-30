import { readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = path.resolve(import.meta.dirname, '..')
const publicRoot = path.join(projectRoot, 'public')
const images = [
  ['watch-31.jpg', 'watch-31-v2.webp', 1920, 82],
  ['Rolex Wimbledon.jpg', 'rolex-wimbledon-v2.webp', 1920, 82],
  ['Patek Philippe Nautilus-12.jpg', 'patek-philippe-nautilus-v2.webp', 1920, 82],
  ['Franck Muller Vegas4.jpg', 'franck-muller-vegas4-v2.webp', 1920, 82],
  ['butikmain.jpg', 'butikmain-v2.webp', 1920, 82],
  ['chopard.jpg', 'chopard-v2.webp', 1400, 78],
  ['patek.jpg', 'patek-v2.webp', 1400, 78],
  ['ap.jpg', 'ap-v2.webp', 1400, 78],
]

for (const [sourceName, outputName, maxDimension, quality] of images) {
  const source = path.join(publicRoot, sourceName)
  const output = path.join(publicRoot, outputName)
  await sharp(source)
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output)

  const [before, after] = await Promise.all([stat(source), stat(output)])
  console.log(
    `${sourceName}: ${formatBytes(before.size)} -> ${outputName}: ${formatBytes(after.size)}`,
  )
}

for (const fileName of ['opengraph-image.jpg', 'twitter-image.jpg']) {
  const source = path.join(projectRoot, 'app', fileName)
  const before = await stat(source)
  const input = await readFile(source)
  const metadata = await sharp(input).metadata()
  if (before.size <= 300 * 1024 && (metadata.width ?? 0) <= 1200) continue

  const optimized = await sharp(input)
    .rotate()
    .resize({
      width: 1200,
      height: 630,
      fit: 'cover',
      position: 'attention',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 82,
      chromaSubsampling: '4:2:0',
      mozjpeg: true,
    })
    .toBuffer()
  await writeFile(source, optimized)
  const after = await stat(source)
  console.log(`${fileName}: ${formatBytes(before.size)} -> ${formatBytes(after.size)}`)
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}
