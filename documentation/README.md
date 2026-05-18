# Warszawski Czas — strona internetowa

Statyczny widok ekspozycji butiku zegarków premium (Mokotowska 71, Warszawa). Dane produktów i obsługa leadów żyją w osobnym CMS-ie — strona jest read-only powierzchnią dostarczania treści.

## Architektura

- **Next.js 15 + React 19** w trybie `output: 'export'` — wynik buildu (`out/`) to czysty HTML/CSS/JS gotowy na dowolny statyczny hosting
- **Hosting produkcyjny:** Hostinger Business (Apache + `public/.htaccess`)
- **CMS:** osobna aplikacja, komunikacja przez `from-cms/adapters/*` (tryb `mock` na fixtures lub `live` przez HTTPS)
- **Obrazy produktów:** Cloudflare R2 + custom domena `cdn.warszawskiczas.pl`
- **i18n:** PL/EN/UA — PL na root (`/produkty`), EN/UA jako subfolder (`/en/products`, `/ua/products`), wszystko prerenderowane przy buildzie przez catch-all `app/(public)/[locale]/[[...path]]/page.tsx`
- **Formularze:** POST przez `from-cms/adapters/leads.ts` → CMS webhook (w `mock` tryb logują do konsoli)

Detal w [from-cms/README.md](from-cms/README.md).

## Wymagania

- Node.js 20+
- npm

## Praca lokalna

```bash
npm install
npm run dev
```

Strona startuje na `http://localhost:3000`. Domyślnie `CMS_MODE=mock` — wszystkie 65 produktów widoczne z fixtures, formularze logują do konsoli przeglądarki.

## Build produkcyjny

```bash
npm run build
```

Wynik w `out/`. Można obejrzeć lokalnie:

```bash
npx serve out
```

## Deploy

Automatyczny przez GitHub Action `.github/workflows/deploy.yml`:

- **Push na `main`** → build + FTP deploy na Hostinger
- **Webhook z CMS** (`repository_dispatch` `event_type: cms-update`) → identyczny pipeline; CMS triggeruje gdy admin zapisze zmianę w produkcie
- **Manualnie** z GitHub UI (`workflow_dispatch`)

Sekrety GitHub potrzebne do działania:

| Sekret | Cel |
|---|---|
| `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD` | Hostinger FTP (panel Hostingera → SFTP) |
| `CMS_MODE` (opcjonalnie) | `live` jeśli CMS dostępny, inaczej `mock` |
| `CMS_API_URL`, `CMS_API_TOKEN` | Tylko przy `CMS_MODE=live` |
| `NEXT_PUBLIC_CDN_BASE_URL` | Domyślnie `https://cdn.warszawskiczas.pl` |
| `NEXT_PUBLIC_PRIVATE_COLLECTION_CODE` | Kod do teaser-bramki (default fallback w kodzie) |

## Struktura katalogu

```
.
├── app/                      # App Router (Next.js)
│   ├── (public)/             # Wszystkie publiczne route'y (PL na root + catch-all EN/UA)
│   ├── layout.tsx            # Root layout (<html lang="pl">, JSON-LD LocalBusiness)
│   ├── sitemap.ts            # sitemap.xml (force-static)
│   └── robots.ts             # robots.txt (force-static)
├── components/               # UI, sekcje, formularze (komponenty domeny strony)
├── from-cms/                 # Granica strona ↔ CMS — adaptery, schemas zod, fixtures
├── lib/                      # i18n, utils, SEO product filters
├── public/                   # Statyczne assety + .htaccess dla Apache
└── scripts/                  # Skrypty pomocnicze (migracje, czyszczenie cache)
```

## CMS_MODE

Strona obsługuje dwa tryby pracy adapterów `from-cms/`:

| `CMS_MODE` | Źródło produktów | Formularze | Użycie |
|---|---|---|---|
| `mock` (default) | `from-cms/fixtures/products.json` | `console.info('[from-cms:mock-lead]', payload)` | Lokalny dev, build na PR-ach, demo bez CMS |
| `live` | `GET ${CMS_API_URL}/api/v1/products` | `POST ${CMS_API_URL}/api/v1/leads` | Produkcja po wdrożeniu CMS |

Przełącznik jest read-only po inicjalizacji procesu. Adapter waliduje odpowiedź CMS przez zod — jeśli kontrakt się rozjedzie, build padnie z czytelnym błędem.

## Linki

- Plan przebudowy: [ARCHITECTURE-REVIEW.md](ARCHITECTURE-REVIEW.md)
- Granica strona ↔ CMS: [from-cms/README.md](from-cms/README.md)
