---
name: cdn-image-variants
description: Product images have pre-built CDN WebP variants (thumb/medium) — render those, not originals
metadata:
  type: project
---

Product images live on R2 CDN (`cdn.camalio.pl`, allowed in `next.config.js` remotePatterns). For every original `products/<slug>/<file>.jpg` the CMS also generated two WebP variants at `products/<slug>/_variants/<file>-<variant>.webp`: `thumb` (≤480 px) and `medium` (≤1400 px). Originals can be multi-MB (e.g. 455 KB JPG → 20 KB thumb / 105 KB medium), so grids/galleries MUST render a variant.

Next `images.unoptimized: true` (Hostinger has no `sharp`), so `next/image` passes `src` through untouched — `sizes`/srcset do nothing. The only lever for image weight is choosing the right URL ourselves.

Helper: `cdnImageVariant(url, 'thumb'|'medium')` in [lib/cdn-image.ts]. Only rewrites absolute CDN originals; leaves local mock paths (`/products/...`) and already-variants unchanged. NOTE: the helper has NO runtime fallback — if a matching CDN original's `_variants/...webp` was never generated (fresh/re-uploaded product), it 404s. So always render through the `ProductImage` client wrapper (`components/products/product-image.tsx`), which computes the variant and `onError`→falls back to the original once. Broken catalog image (Rolex DateJust 41, 2026-07) was a missing thumb variant with no fallback.

Current usage (all via ProductImage): product-card grid+feature=medium, seo-landing preview=medium, product-showcase featured+scroller=medium, product-gallery main/lightbox=medium, gallery thumbs=thumb. Catalog/showcase/preview were bumped thumb→medium because 480px thumb upscaled blurry on retina (unoptimized = no srcset). If medium still looks soft, raise the CMS variant width/quality in the app's `upload-image-variants.mjs` and re-publish. RelatedGrid inherits via ProductCard.

Still unoptimized (separate follow-up): large static `/public/*.jpg` heroes/OG (watch-31.jpg 7.4 MB, Patek Nautilus 4.28 MB, Rolex Wimbledon 3.81 MB) and the 186 MB `/public/products` folder (only used in mock mode; live serves from CDN). Related: [[cms-website-publish-boundary]].
