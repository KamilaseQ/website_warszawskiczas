---
name: private-collection-removed
description: Kolekcja prywatna („Ukryta Kolekcja") została usunięta ze strony 2026-08-29 i przekierowana na katalog
metadata:
  type: project
  updated: 2026-08-29
---

Na wyraźną decyzję właściciela (2026-08-29) trasa `/kolekcja-na-zapytanie` i cała sekcja kolekcji prywatnej zostały USUNIĘTE, nie ukryte: skasowane `components/pages/private-collection-page.tsx`, wszystkie `components/sections/private-collection-*` i `hidden-collection-teaser`, linki z nawigacji, menu mobilnego, stopki i CTA w katalogu.

Przekierowania trwałe: `/kolekcja-na-zapytanie` i `/ukryta-kolekcja` → `/produkty` w `next.config.js`; `/en/private-collection` → `/en/products` i `/ua/приватна-колекція` → `/ua/каталог` przez `permanentRedirect()` w `app/(public)/[locale]/[[...path]]/page.tsx` (tam ścieżka jest już zdekodowana z UTF-8 — cyrylicki slug w `next.config` byłby ryzykowny).

Dlatego mapowania slugów `kolekcja-na-zapytanie` ZOSTAŁY w `SEGMENT_TRANSLATIONS` w `lib/i18n.ts` — bez nich `/en/private-collection` nie zostałoby rozpoznane i dałoby 404 zamiast 308. Nie kasować ich „przy sprzątaniu".

Sitemapa: 297 URL-i (było 300), zero sierot, `npm run verify:seo` zielone. `PRIVATE_COLLECTION_CODE` w env jest już martwe. Szczegóły: `documentation/SEO-INDEXATION.md` → „Trasy wycofane". Powiązane: [[seo-orphan-landings-fix]].
