# `from-cms/` — granica systemu strona ↔ CMS

To jest **jedyna** warstwa kodu strony, która rozmawia z CMS-em. Reszta projektu importuje tylko z `from-cms/adapters/*` i typy z `from-cms/schemas/*`. Żaden plik poza tym folderem nie powinien wykonywać `fetch()` do CMS-a ani znać `CMS_API_URL`.

## Struktura

```
from-cms/
├── mode.ts                 — wyłącznie serwerowy przełącznik CMS_MODE + sekrety
├── public-lead.ts          — client-safe NEXT_PUBLIC_CMS_LEAD_URL
├── schemas/                — zod schemas + TS types (SSOT kontraktu)
│   ├── product.ts
│   ├── lead.ts
│   └── translation.ts
├── fixtures/               — dane atrapy używane w mock mode
│   ├── products.json       — 65 produktów z byłego data/mock-products.ts
│   └── translations.json   — placeholder, na razie puste słowniki per locale
└── adapters/               — funkcje używane przez resztę projektu
    ├── products.ts         — getAllProducts, getProductBySlug, productUrlSlug, ...
    ├── leads.ts            — submitLead
    └── translations.ts     — getTranslationBundle, getTranslation
```

## Tryby pracy

### `CMS_MODE=mock` (jawny w buildzie, domyślny tylko w dev)

Strona uruchamia się bez zewnętrznej zależności dla produktów. Wszystkie 65 produktów są widoczne z fixtures.

Formularze zależą od `NEXT_PUBLIC_CMS_LEAD_URL`, a nie od `CMS_MODE`:

- jeśli `NEXT_PUBLIC_CMS_LEAD_URL` jest ustawione, formularze robią realny `POST /api/v1/leads`,
- jeśli nie jest ustawione, formularze wykonują `console.info('[from-cms:mock-lead]', payload)`.

To jest tryb używany automatycznie w lokalnym `npm run dev` i jawnie przez
`CMS_MODE=mock` w buildach weryfikacyjnych na PR-ach. W `NODE_ENV=production`
brak `CMS_MODE` lub nieznana wartość przerywa build.

### `CMS_MODE=live`

Adaptery wykonują prawdziwe HTTP do CMS-a. Wymaga ustawienia:

```bash
CMS_MODE=live
CMS_API_URL=<CMS_API_ORIGIN z documentation/CMS-CRM-ENVIRONMENT.md>
CMS_API_TOKEN=<token wygenerowany w CMS-ie, read-only>
NEXT_PUBLIC_CMS_LEAD_URL=<NEXT_PUBLIC_CMS_LEAD_URL z documentation/CMS-CRM-ENVIRONMENT.md>
```

`getAllProducts()` cache-uje w pamięci modułu w obrębie jednego procesu (build SSG `next build` woła setki razy podczas generowania ~120 stron — chcemy jeden fetch).

## Kontrakt z CMS-em

Schematy w `schemas/` są **wiążące** dla CMS-a:

- `GET /api/v1/products` musi zwrócić tablicę walidującą się przez `ProductListSchema`
- `POST /api/v1/leads` musi przyjąć body walidujące się przez `LeadPayloadSchema` i zwrócić odpowiedź walidującą się przez `LeadResponseSchema`
- `GET /api/v1/translations?locale=...` musi zwrócić obiekt walidujący się przez `TranslationBundleSchema`

Kontrakt obrazów jest rozszerzony zgodnie wstecz: preferowane `imageAssets[]` zawiera jawne `original`, opcjonalną parę `thumb`/`medium` i `alt`, a dotychczasowe `images[]` pozostaje podczas okresu przejściowego. Dodanie pola opcjonalnego nie wymaga `/api/v2/`; zmiana lub usunięcie istniejącego pola nadal wymaga nowej wersji endpointu.

## Reguły użycia w reszcie projektu

✅ DO:

```ts
import { getAllProducts, productUrlSlug } from '@/from-cms/adapters/products'
import type { Product } from '@/from-cms/schemas/product'
```

❌ DON'T:

```ts
// Nie ma już mocka — to nie skompiluje się po Etapie 1.
import { mockProducts } from '@/data/mock-products'

// Reszta projektu NIE robi fetch do CMS-a samodzielnie.
const res = await fetch(`${process.env.CMS_API_URL}/api/v1/products`)
```

## Migracja na żywy CMS

Gdy CMS będzie gotowy:

1. Ustaw env vary (`.env.production` na hostingu / sekrety GitHub Actions)
2. `CMS_MODE=live` w build pipeline
3. Pierwszy build → adapter pobierze, zwaliduje, wygeneruje strony
4. Jeśli walidacja zod failuje → CMS nie spełnia kontraktu — popraw CMS, nie schemat

Schematy w `schemas/` zostają niezmienione — to one są autorytetem.
