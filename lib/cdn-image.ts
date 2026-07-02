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

export function cdnImageVariant(
  url: string | undefined,
  variant: CdnImageVariant,
): string | undefined {
  if (!url) return url
  // Tylko absolutne URL-e CDN mają warianty. Lokalne `/products/...` (mock/dev) zostają.
  if (!/^https?:\/\//i.test(url)) return url
  // Już wariant — nie zagnieżdżamy `_variants/_variants`.
  if (url.includes('/_variants/')) return url
  const match = url.match(/^(.*\/)([^/]+)\.(?:jpe?g|png|webp)$/i)
  if (!match) return url
  const [, dir, base] = match
  return `${dir}_variants/${base}-${variant}.webp`
}
