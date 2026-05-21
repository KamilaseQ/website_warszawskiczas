# Obrazy produktów na CDN — instrukcja wdrożenia

> Status: **niezrealizowane** — obrazy dziś nadal siedzą w `/public/products/<slug>/*.jpg`. Ten dokument opisuje plan migracji do **Cloudflare R2** + custom domain `CMS_CDN_HOST` z [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md). Wymaga jednorazowego setupu zewnętrznego (Cloudflare konto, DNS), nie da się zrobić tylko zmianą kodu w repo.

## Dlaczego R2

| Aspekt | R2 |
|---|---|
| Storage 10 GB | 0 zł/mies |
| Egress (transfer wychodzący) | **0 zł** zawsze (kluczowa cecha) |
| Cele ruchu 5k uu/mies × 10 zdjęć × 500 KB = 25 GB/mies | mieści się w free tier |
| Niezależność od CMS w runtime | strona nie pada gdy CMS pada |
| Custom domena | tak (CNAME przez Cloudflare DNS) |

Alternatywy rozważone: **Bunny Storage** (taniej za storage, płatne egress ~$0.005/GB), **Cloudflare Images** (drogie przy ~100 obrazach), **Backblaze B2** (dobre dla większych workloadów).

## Plan migracji (1 dzień)

### 1. Setup Cloudflare R2 (15 min)
1. Załóż konto Cloudflare (jeśli nie masz)
2. Dashboard → R2 → **Create bucket** `R2_PRODUCTS_BUCKET` z dokumentu środowiska
3. **Settings** → **Public access**: dodaj custom domain `CMS_CDN_HOST`
4. W DNS Cloudflare dodaj CNAME dla prefiksu z `CMS_CDN_HOST` → `<bucket>.r2.dev` (Cloudflare zaproponuje automatycznie)
5. Wygeneruj **API token** (R2 → API → Manage API Tokens) — przyda się dla skryptu migracji

### 2. Skrypt jednorazowy upload `/public/products/**` → R2

Stwórz `scripts/upload-images-to-r2.mjs`:

```js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})
const BUCKET = process.env.R2_PRODUCTS_BUCKET
if (!BUCKET) throw new Error('Missing R2_PRODUCTS_BUCKET')
const root = 'public/products'

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else yield full
  }
}

const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

for (const file of walk(root)) {
  const key = relative(root, file).replace(/\\/g, '/')
  const ext = extname(file).toLowerCase()
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: readFileSync(file),
    ContentType: mime[ext] ?? 'application/octet-stream',
    CacheControl: 'public, max-age=31536000, immutable',
  }))
  console.log('uploaded', key)
}
```

Uruchom z env:
```bash
R2_PRODUCTS_BUCKET=<z CMS-CRM-ENVIRONMENT.md> R2_ACCOUNT_ID=xxx R2_ACCESS_KEY_ID=xxx R2_SECRET_ACCESS_KEY=xxx \
  node scripts/upload-images-to-r2.mjs
```

(Wymaga `npm install --save-dev @aws-sdk/client-s3` — R2 jest S3-kompatybilny.)

### 3. (Opcjonalnie) Pre-generowanie wariantów WebP

Przed uploadem zrób resize do 3 rozmiarów:

```js
// scripts/resize-images.mjs (przed upload-images-to-r2)
import sharp from 'sharp'
// dla każdego front.jpg → front-thumb.webp (400), front-medium.webp (1200), front-full.webp (2400)
```

Wymaga `npm install --save-dev sharp`.

### 4. Aktualizacja `from-cms/fixtures/products.json`

W każdym wpisie zamień:
```json
"images": ["/products/breitling-niebieski/front.jpg", ...]
```
na:
```json
"images": [
  "${CMS_CDN_ORIGIN}/breitling-niebieski/front.jpg",
  ...
]
```

Skrypt jednorazowy `scripts/rewrite-image-urls-to-cdn.mjs`:

```js
import { readFileSync, writeFileSync } from 'node:fs'
const path = 'from-cms/fixtures/products.json'
const data = JSON.parse(readFileSync(path, 'utf8'))
const CDN = process.env.NEXT_PUBLIC_CDN_BASE_URL
if (!CDN) throw new Error('Missing NEXT_PUBLIC_CDN_BASE_URL')
for (const p of data) {
  if (!p.images) continue
  p.images = p.images.map((src) =>
    src.startsWith('/products/')
      ? `${CDN}${src.replace('/products', '')}`
      : src,
  )
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
```

### 5. Usunięcie `/public/products/` z repo

Po weryfikacji że R2 serwuje (otwórz `${CMS_CDN_ORIGIN}/breitling-niebieski/front.jpg` w przeglądarce):

```bash
git rm -r public/products
git commit -m "remove product images from repo (migrated to R2 CDN)"
```

Repo schudnie o setki MB.

### 6. Weryfikacja po deploy

- [ ] Wszystkie strony produktów wyświetlają obrazy z `CMS_CDN_HOST`
- [ ] DevTools → Network: obrazy zwracają `200`, header `cf-cache-status: HIT`
- [ ] Lighthouse LCP nie pogorszył się względem baseline
- [ ] OG-image w karcie produktu (Twitter Card / FB share) ładuje CDN URL

## Po wdrożeniu CMS (faza `live`)

Workflow uploadu obrazów przenosi się do CMS:

1. Admin w panelu CMS wrzuca oryginalne JPG
2. CMS używa `sharp` → 3 warianty WebP
3. CMS uploaduje do R2 z kluczem `<product-slug>/<filename>-<variant>.webp`
4. URL-e zapisane w DB jako pełne `CMS_CDN_ORIGIN/...`
5. `GET /api/v1/products` zwraca te URL-e w polu `images`
6. Strona przy buildzie pobiera, generuje HTML z gotowymi `<img src>`

Patrz **Sekcja B i A4** w `ARCHITECTURE-REVIEW.md` checklisty 2.

## CORS

R2 musi pozwolić na hotlinking ze strony. Domyślnie publiczna domena pozwala. Jeśli włączysz custom CSP po stronie strony (`Content-Security-Policy: img-src 'self' CMS_CDN_HOST` po podstawieniu realnego hosta), aktualizuj `public/.htaccess`.

## Koszt rzeczywisty

Przy 200 produktach × 5 zdjęć × 500 KB = **500 MB storage** + 25 GB egress/mies = **0 zł na R2 free tier**. Próg płatny zaczyna się przy ~5000 produktów lub bardzo wysokim ruchu (>100 GB/mies egress) — wtedy ~$0.015/GB storage, dalej zero egress.
