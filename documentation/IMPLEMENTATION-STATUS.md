# Aktualny stan wdrożenia

> Ostatnia aktualizacja: 2026-07-21. Ten dokument zastępuje historyczną checklistę statycznego eksportu.

## Środowisko produkcyjne

- Next.js 15 + React 19 w trybie serwerowym.
- Hostinger wykonuje `npm run build` i uruchamia `npm run start`.
- Artefakt aplikacji: `.next`; `out/` i własny `.htaccess` nie są używane.
- Produkty pochodzą z osobnego CMS-u przez `from-cms/adapters/products.ts`.
- Formularz kontaktowy używa `/api/contact` i SMTP; lead do aplikacji CMS jest osobnym kanałem.
- Obrazy produkcyjne są dostarczane z `cdn.camalio.pl`.

## Zrealizowane podstawy SEO — 2026-07-21

- [x] Automatyczny crawl produkcyjnego builda w CI.
- [x] Walidacja statusów, title, description, H1, canonical, hreflang i JSON-LD.
- [x] Walidacja obrazów metadata i sitemapy.
- [x] Walidacja grafu linków, sierot i głębokości.
- [x] Usunięty niebezpieczny globalny canonical strony głównej.
- [x] Poprawne self-canonical dla kolekcji prywatnej, polityki prywatności i regulaminu.
- [x] Niedokończony regulamin ma `noindex,follow` i nie występuje w sitemapie/hreflang.
- [x] Strony podziękowania mają `noindex,follow` i nie występują w sitemapie/hreflang.
- [x] Sitemap zawiera tylko indeksowalne adresy 200.
- [x] Pełne URL-e CDN nie są sklejane z domeną strony.
- [x] `lastmod` produktów pochodzi wyłącznie z prawidłowych dat CMS.
- [x] Przełącznik języka renderuje prawdziwe linki HTML.
- [x] Globalny hub linkuje wszystkie indeksowalne landingi.
- [x] Zero stron osieroconych w buildzie mock.
- [x] Wszystkie wpisy sitemapy są osiągalne od `/` w maksymalnie trzech krokach.
- [x] Brak zaakceptowanych wyjątków w `seo-audit-known-issues.json`.

## Wynik referencyjnego builda mock

- 65 produktów w fixtures,
- 316 wygenerowanych stron aplikacji,
- 300 indeksowalnych URL-i w sitemapie,
- 6 jawnie kontrolowanych stron `noindex`,
- 0 błędów pełnego `npm run verify`.

Liczba URL-i produkcyjnych zależy od liczby produktów pobranych z CMS-u. Stała część sitemapy to 35 stron na język; każdy produkt dodaje trzy adresy językowe.

## Nadal do wykonania

### Treść i polityka językowa

- [ ] Ograniczyć indeksowanie automatycznych, powtarzalnych treści EN/UA.
- [ ] Wprowadzić status tłumaczenia `auto/reviewed/manual`.
- [ ] Zastąpić generowane opisy produktów pełnymi tłumaczeniami.
- [ ] Rozdzielić lub skonsolidować strony o nakładającej się intencji.
- [ ] Uzupełnić właściwy regulamin i dopiero wtedy zdjąć `noindex`.

### Obrazy i wydajność

- [ ] Zlikwidować zapytania do nieistniejących wariantów `_variants`.
- [ ] Ustalić jawny kontrakt `original/thumb/medium` albo przetestować optymalizator Next.js na Hostingerze.
- [ ] Zmniejszyć koszt filmu hero i ciężkich obrazów produktów.
- [ ] Ponownie zmierzyć Lighthouse po zmianach obrazów.

### Pozostałe SEO i dostępność

- [ ] Skrócić i ujednolicić title oraz description.
- [ ] Poprawić serwerowy `<html lang>` dla EN/UA.
- [ ] Ujednolicić dane firmy i profile `sameAs` w schema.
- [ ] Poprawić kontrast małych tekstów w stopce i akcentów.

### Działania zewnętrzne

- [ ] Zweryfikować poprawki po deployu w Google Search Console.
- [ ] Przesłać sitemapę i wykonać kontrolę najważniejszych URL-i.
- [ ] Rozwijać Google Business Profile, opinie i jakościowe linki zewnętrzne.

## Weryfikacja przed wdrożeniem

```bash
npm run verify
```

Po deployu należy dodatkowo wykonać crawl publicznej domeny, ponieważ lokalny build nie potwierdza dostępności zewnętrznych plików CDN ani zachowania cache Hostingera.

## Aktywna dokumentacja operacyjna

- [README.md](README.md) — architektura i komendy,
- [HOSTINGER-DEPLOYMENT.md](HOSTINGER-DEPLOYMENT.md) — hosting Node,
- [SEO-QUALITY-GATES.md](SEO-QUALITY-GATES.md) — automatyczne testy,
- [SEO-INDEXATION.md](SEO-INDEXATION.md) — canonical, noindex i sitemap,
- [INTERNAL-LINKING.md](INTERNAL-LINKING.md) — graf linków i wersje językowe,
- [IMAGES-CDN.md](IMAGES-CDN.md) — aktualny model obrazów,
- [FROM-CMS-BOUNDARY.md](FROM-CMS-BOUNDARY.md) — kontrakt strony z CMS-em.

Pozostałe dokumenty planistyczne i audyty zachowano jako historię projektu; nie są instrukcją bieżącego wdrożenia.
