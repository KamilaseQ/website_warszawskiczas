/**
 * Warianty obrazów produktów z CDN (R2, `cdn.camalio.pl`).
 *
 * CMS przy publikacji trzyma dla każdego zdjęcia dwa gotowe warianty WebP obok
 * oryginału, pod kluczem `products/<slug>/_variants/<plik>-<wariant>.webp`:
 *  - `thumb`  — maks. 480 px (siatki, podglądy, miniatury),
 *  - `medium` — maks. 1400 px (duży obraz / galeria / hero).
 *
 * Oryginalne `.jpg` potrafią ważyć kilka MB — to główna przyczyna wolnego
 * ładowania. Na siatkach i galeriach renderujemy lekki WebP zamiast oryginału
 * (np. 455 KB JPG → 20 KB thumb / 105 KB medium).
 *
 * Rewrite dotyczy TYLKO absolutnych URL-i CDN wskazujących na oryginał. Lokalne
 * ścieżki mock-mode (`/products/...`), URL-e spoza wzorca i już-warianty zostają
 * bez zmian — fallbackiem zawsze jest oryginał, więc dev i ewentualne obrazy bez
 * wariantu nie znikają.
 */
export type CdnImageVariant = 'thumb' | 'medium'

const PRODUCT_CDN_HOSTS = new Set([
  'cdn.camalio.pl',
  'cdn.warszawskiczas.pl',
  configuredCdnHost(),
].filter((host): host is string => Boolean(host)))

export function cdnImageVariant(
  url: string | undefined,
  variant: CdnImageVariant,
): string | undefined {
  if (!url) return url
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) return url
  if (!PRODUCT_CDN_HOSTS.has(parsed.hostname.toLowerCase())) return url
  // Już wariant — nie zagnieżdżamy `_variants/_variants`.
  if (parsed.pathname.includes('/_variants/')) return url
  const match = parsed.pathname.match(/^(.*\/)([^/]+)\.(?:jpe?g|png|webp)$/i)
  if (!match) return url
  const [, dir, base] = match
  parsed.pathname = `${dir}_variants/${base}-${variant}.webp`
  return parsed.toString()
}

function configuredCdnHost(): string | null {
  try {
    const configured = process.env.NEXT_PUBLIC_CDN_BASE_URL
    return configured ? new URL(configured).hostname.toLowerCase() : null
  } catch {
    return null
  }
}
