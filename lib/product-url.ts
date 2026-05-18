/**
 * Pure utility: kanoniczny URL slug produktu z marki + nazwy.
 *
 * Wydzielony z `from-cms/adapters/products` żeby komponenty klienta mogły
 * używać slug-a bez wciągania całego adaptera CMS (który zna env, fixtures
 * i waliduje zod). Granica strona ↔ CMS pozostaje czysta.
 */

export function productUrlSlug(p: { brand: string; name: string }): string {
  const raw = `${p.brand} ${p.name}`
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
