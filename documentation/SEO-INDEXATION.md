# Polityka indeksowania i sitemapy

> Stan: 2026-07-21. Ten dokument jest źródłem prawdy dla lokalnej polityki technicznej SEO.

## Zasady

1. Sitemap zawiera wyłącznie publiczne adresy zwracające 200, które mogą być indeksowane.
2. Każdy wpis sitemapy ma dokładnie jeden self-canonical.
3. Hreflang jest emitowany tylko dla zestawu indeksowalnych odpowiedników PL/EN/UA.
4. Publiczna strona `noindex` pozostaje dostępna, ma self-canonical i `follow`, ale nie występuje w sitemapie ani hreflang.
5. Pełny URL obrazu z CMS/CDN nie jest modyfikowany. Domena witryny jest dodawana wyłącznie do ścieżek względnych.
6. `lastmod` jest emitowany tylko z prawidłowego `updatedAt` lub `publishedAt` produktu. Dla zwykłych stron bez wiarygodnej daty pole jest pomijane.
7. `priority` i `changefreq` nie są emitowane.

## Źródła prawdy w kodzie

- `lib/i18n.ts` — budowa kanonicznych i lokalizowanych URL-i,
- `lib/seo-routes.ts` — publiczne trasy wyłączone z indeksu,
- `app/sitemap.ts` — generowanie sitemapy,
- metadata poszczególnych stron — canonical, robots i hreflang,
- `scripts/seo-audit-policy.json` — niezależna lista kontrolna oczekiwanych stron `noindex`.

Rozdzielenie polityki aplikacji i listy kontrolnej jest celowe: przypadkowa zmiana jednego pliku nie może automatycznie zmienić oczekiwań testu.

## Aktualne strony `noindex`

### Strony podziękowania

- `/kontakt/dziekujemy`,
- `/en/contact/thank-you`,
- `/ua/контакт/дякуємо`.

Nie są samodzielnymi stronami docelowymi z wyszukiwarki.

### Niedokończony regulamin

- `/regulamin`,
- `/en/terms`,
- `/ua/правила`.

Strony pozostają dostępne z nawigacji i dla użytkowników, ale nie są oferowane Google do indeksowania, ponieważ polski dokument zawiera komunikat o planowanym uzupełnieniu, a wersje językowe są tylko skrótem. Po dostarczeniu kompletnej treści należy w jednym commicie:

1. usunąć `/regulamin` z `nonIndexablePublicRoutePaths`,
2. usunąć `noIndex` dla odpowiedników EN/UA,
3. przywrócić pełne `localizedAlternates`,
4. usunąć trzy adresy z `seo-audit-policy.json`,
5. uruchomić `npm run verify`.

## Trasy wycofane

Trasa zdjęta ze strony nie może zwrócić 404 — traci wtedy cały zebrany link
juice i psuje pokrycie w GSC. Obowiązująca procedura: usuń stronę i wszystkie
linki do niej, wypisz trasę z `publicRoutePaths` (znika z sitemapy, hreflang
i `generateStaticParams`), a stary adres przekieruj trwale na najbliższy
tematycznie żywy URL.

### `/kolekcja-na-zapytanie` — kolekcja prywatna (usunięta 2026-08-29)

| Stary adres | Cel |
|---|---|
| `/kolekcja-na-zapytanie` | `/produkty` |
| `/ukryta-kolekcja` (starszy alias) | `/produkty` — **wprost**, bez łańcucha przez nieistniejącą trasę |
| `/en/private-collection` | `/en/products` |
| `/ua/приватна-колекція` | `/ua/каталог` |

Warianty PL obsługuje `redirects()` w `next.config.js`. Warianty EN/UA
obsługuje `permanentRedirect()` w `app/(public)/[locale]/[[...path]]/page.tsx` —
tam ścieżka jest już zdekodowana z UTF-8, więc cyrylicki slug działa niezależnie
od tego, czy przeglądarka wysłała go zakodowanego procentowo. Z tego samego
powodu mapowania slugów `kolekcja-na-zapytanie` zostały w `SEGMENT_TRANSLATIONS`
w `lib/i18n.ts`: bez nich `/en/private-collection` nie zostałoby rozpoznane
i skończyłoby 404 zamiast przekierowaniem.

Po zmianie sitemapa ma 297 URL-i (było 300 — trzy warianty językowe tej trasy),
zero sierot i zero nieosiągalnych adresów (`npm run verify:seo`).

## Obrazy produktów

`absoluteUrl()` rozpoznaje wejście `http://` i `https://`. Dla takiego wejścia zwraca URL bez dołączania `warszawskiczas.pl`. Naprawa obejmuje:

- `og:image` i `twitter:image` polskich produktów,
- metadata produktów EN/UA,
- `image:loc` w sitemapie.

Kontrola syntaktyczna działa w każdym buildzie. Dodatkowa kontrola z danymi live CMS jest wymagana przed wdrożeniem zmian w kontrakcie obrazów.
