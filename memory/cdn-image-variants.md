---
name: cdn-image-variants
description: Product images have pre-built CDN WebP variants (thumb/medium) — render those, not originals
metadata:
  type: project
---

Product images live on R2 CDN (`cdn.camalio.pl`, allowed in `next.config.js` remotePatterns). For every original `products/<slug>/<file>.jpg` the CMS also generated two WebP variants at `products/<slug>/_variants/<file>-<variant>.webp`: `thumb` (≤480 px) and `medium` (≤1400 px). Originals can be multi-MB (e.g. 455 KB JPG → 20 KB thumb / 105 KB medium), so grids/galleries MUST render a variant.

Next `images.unoptimized: true` (Hostinger has no `sharp`), so `next/image` passes `src` through untouched — `sizes`/srcset do nothing. The only lever for image weight is choosing the right URL ourselves.

Helper: `cdnImageVariant(url, 'thumb'|'medium')` in [lib/cdn-image.ts]. Only rewrites absolute CDN originals; leaves local mock paths (`/products/...`) and already-variants unchanged (fallback = original). Applied in product-card (grid=thumb, feature=medium), seo-landing preview (thumb), product-showcase (featured=medium, scroller=thumb), product-gallery (main/lightbox=medium, thumbs=thumb). RelatedGrid inherits via ProductCard.

Still unoptimized (separate follow-up): large static `/public/*.jpg` heroes/OG (watch-31.jpg 7.4 MB, Patek Nautilus 4.28 MB, Rolex Wimbledon 3.81 MB) and the 186 MB `/public/products` folder (only used in mock mode; live serves from CDN). Related: [[cms-website-publish-boundary]].
