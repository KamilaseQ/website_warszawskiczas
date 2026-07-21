# Automatyczne kontrole SEO

> Stan: 2026-07-21. Dokument opisuje kontrole wykonywane na produkcyjnym buildzie lokalnym i w GitHub Actions.

## Cel

Skrypty w `scripts/seo-audit*.mjs` zabezpieczają indeksowalność przed regresją. Źródłem listy stron jest wygenerowane `/sitemap.xml`, dzięki czemu test obejmuje również dynamiczną liczbę produktów z CMS-u lub fixtures.

## Uruchamianie

Pełny proces, łącznie z buildem:

```bash
npm run verify
```

Kontrola istniejącego `.next`:

```bash
npm run verify:seo
```

`verify:seo` uruchamia `next start` na lokalnym porcie, czeka na gotowość serwera, wykonuje crawl i zatrzymuje proces. Domyślny port to `3137`; można go zmienić przez `SEO_AUDIT_PORT`.

Kontrole cząstkowe są przeznaczone do pracy z już uruchomionym serwerem:

```bash
CHECK_BASE_URL=http://localhost:3000 npm run check:seo
CHECK_BASE_URL=http://localhost:3000 npm run check:links
CHECK_BASE_URL=http://localhost:3000 npm run check:images
CHECK_BASE_URL=http://localhost:3000 npm run check:product-urls
```

## Sprawdzane reguły

### Sitemap i strony

- unikalne URL-e w sitemapie,
- odpowiedź HTTP 200 bez przekierowania,
- dokument HTML,
- dokładnie jeden niepusty `title`, description i H1,
- brak `noindex` w sitemapie,
- zgodność jawnej listy stron `noindex` (200, self-canonical, brak hreflang i brak w sitemapie),
- dokładnie jeden self-canonical,
- cztery unikalne wpisy hreflang,
- wzajemność hreflang,
- poprawna składnia wszystkich bloków JSON-LD.

### Produkty

- obecność produktów PL, EN i UA,
- identyczna liczba produktów w każdym języku,
- brak duplikatów URL-i.

### Linkowanie

- brak stron osieroconych,
- zwykłe linki HTML pomiędzy stronami głównymi PL/EN/UA,
- trzy unikalne cele przełącznika języka zgodne z hreflang bieżącej strony,
- osiągalność wszystkich URL-i z polskiej strony głównej,
- maksymalna głębokość trzech linków.

### Obrazy

- poprawne URL-e w `image:loc`, `og:image`, `twitter:image`, `img src` i `srcset`,
- wykrywanie sklejonych adresów typu `warszawskiczas.plhttps...`.

## Znane problemy jako kontrolowany baseline

Plik `scripts/seo-audit-known-issues.json` przechowuje wyłącznie dokładnie rozpoznane problemy istniejące przed wdrożeniem napraw. Znany problem jest ostrzeżeniem, ale każda nowa regresja zatrzymuje test.

Po naprawie canonicali, sitemapy i linkowania baseline nie zawiera żadnego
zaakceptowanego problemu. Wszystkie tablice i liczniki w
`seo-audit-known-issues.json` mają wartość pustą lub zero. Każde nowe naruszenie
zatrzymuje kontrolę.

Oczekiwane publiczne strony `noindex` znajdują się w
`scripts/seo-audit-policy.json`. Nie są wyjątkami od błędu — test wymaga, aby
każda z nich miała 200, `noindex,follow`, self-canonical, zero hreflang i nie
znajdowała się w sitemapie.

Wyjątek musi zostać usunięty z pliku w tym samym commicie, w którym naprawiany jest problem. Skrypt traktuje nieaktualny wyjątek jako błąd, dlatego baseline nie może ukrywać już naprawionych problemów.

## GitHub Actions

Workflow `.github/workflows/deploy.yml` wykonuje:

1. `npm ci`,
2. typecheck,
3. `next build`,
4. kontrolę istnienia `.next`,
5. `npm run verify:seo`.

Workflow weryfikuje kod na pull requestach i pushach do `main`. Faktyczne wdrożenie wykonuje integracja Hostingera.
