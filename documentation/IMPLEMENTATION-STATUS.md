# Stan wdrożenia — checklista operacyjna

> Data ostatniej aktualizacji: 2026-05-18
> Źródło prawdy planu: [ARCHITECTURE-REVIEW.md](ARCHITECTURE-REVIEW.md) (sekcja 10) + [CMS-CRM-APP-PLAN.md](CMS-CRM-APP-PLAN.md)
> Środowisko CMS/CRM: [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md)
> Cel: jeden krótki dokument, w którym wiesz co jest zrobione i co jeszcze trzeba.

---

## Aktualizacja 2026-05-21

- [x] CMS/CRM działa na `https://app.camalio.pl`.
- [x] Publiczne API CMS działa na `https://api.camalio.pl`.
- [x] Endpoint leadów `POST https://api.camalio.pl/api/v1/leads` zapisuje poprawny payload do D1.
- [x] API CMS przyjmuje leady z tymczasowego originu Vercel `https://demowarszawskiczas.vercel.app`.
- [x] Workflow deployu strony przekazuje `NEXT_PUBLIC_CMS_LEAD_URL=https://api.camalio.pl/api/v1/leads`.
- [x] Produkty strony nadal zostają w `CMS_MODE=mock` i są budowane z fixtures.
- [x] Aktualny live bundle Vercel został sprawdzony po redeployu i zawiera `https://api.camalio.pl/api/v1/leads`.
- [x] Vercel demo `https://demowarszawskiczas.vercel.app` zostało potwierdzone po redeployu z `NEXT_PUBLIC_CMS_LEAD_URL`.
- [x] Pierwszy lead z formularza Vercel demo został zweryfikowany w PWA.
- [ ] Formularz produktowy i formularz kolekcji prywatnej nie zostały jeszcze zweryfikowane manualnie z CMS.

---

## Architektura w skrócie

```
Strona (statyczna)              CMS (osobna apka)            Storage
─────────────────               ─────────────────            ───────
Next.js 15 → out/               własna aplikacja             Cloudflare R2
   ↓                               ↓                             ↓
Hostinger Business              CMS_APP_HOST / CMS_API_HOST  CMS_CDN_HOST
(public_html/)                  (Cloudflare Workers)         (R2 custom domain)

   ↑                               ↑                             ↑
   └──── from-cms/adapters ────────┘                             │
            │                                                    │
            └─── obrazy produktów ───────────────────────────────┘
```

**Granica strona ↔ CMS:** folder `from-cms/` z `mode.ts` (`CMS_MODE=mock|live`), schematami zod i adapterami. Przełącznik atrapy: zmieniasz env var, nie kod.

---

## ✅ ZROBIONE (kod w repo)

### Etap 1 — Granica `from-cms/`
- [x] Folder `from-cms/` z adapterami (`products`, `leads`, `translations`), schematami zod, fixtures (65 produktów), `mode.ts` (`CMS_MODE`), README
- [x] Skrypt jednorazowy `scripts/migrate-products-to-fixtures.mjs` (mock-products.ts → JSON)
- [x] `data/mock-products.ts` usunięte
- [x] Wszystkie 12 importów `mock-products` zmigrowanych na `from-cms/adapters/products`
- [x] `lib/seo-product-filters.ts` przerobione na DI (przyjmują `products: Product[]`)
- [x] `lib/localized-landings.ts` — `definitions` jako factory `buildDefinitions(products)`, `getLocalizedLanding` async
- [x] 7 PL landing pages (`zegarki-*-warszawa`, `chronografy-warszawa`) zrefaktorowane na `async` + `await getAllProducts()`
- [x] Catch-all `[locale]/[[...path]]` zrefaktorowany na adaptery, async dispatch
- [x] `app/sitemap.ts` używa `getAllProducts()` (i pokazuje WSZYSTKIE produkty, łącznie z `Niedostępny`)

### Etap 3 — Formularze przez adapter
- [x] `contact-form.tsx` używa `submitLead({ type: 'contact', ... })`
- [x] `inquiry-form.tsx` używa `submitLead({ type: 'inquiry', ... })`
- [x] `private-collection-registration.tsx` używa `submitLead({ type: 'inquiry', source: 'kolekcja-prywatna', ... })`
- [x] Bramki kodowe (`private-collection-featured`, `private-collection-gallery`) — walidacja kodu w przeglądarce z env `NEXT_PUBLIC_PRIVATE_COLLECTION_CODE` (kod to teaser, nie zabezpieczenie)

### Etap 4 — i18n bez middleware
- [x] `middleware.ts` usunięte
- [x] `app/layout.tsx` bez `headers()` — `<html lang="pl">` domyślnie
- [x] `app/(public)/layout.tsx` bez `headers()` — alternates są per-page
- [x] hreflang generowany przez `metadata.alternates` (już zaimplementowane w `lib/i18n.ts` `alternateLanguages()`)

### Etap 5 — Static export + deploy pipeline
- [x] `next.config.js` — `output: 'export'` **tylko w produkcyjnym buildzie** (`NODE_ENV=production`), dev mode bez restrykcji
- [x] `app/api/` i `lib/contact/` usunięte
- [x] `public/.htaccess` — 8 redirectów 301, security headers, clean URLs, custom 404, kompresja, cache obrazów
- [x] `app/robots.ts` + `app/sitemap.ts` — `export const dynamic = 'force-static'`
- [x] `.github/workflows/deploy.yml` — trigger push/webhook/manual, build + FTP deploy, concurrency control
- [x] `app/favicon.ico` (kopia `icon.png`) — żeby `/favicon.ico` nie wpadał w catch-all
- [x] Catch-all `generateStaticParams` zwraca raw UTF-8 segmenty (Apache obsługuje natywnie)

### Etap 6 — Statusy dostępności po korekcie kontraktu
- [x] Statusy publiczne: `Dostępny`, `Na zamówienie`, `Niedostępny`
- [x] JSON-LD `Offer.availability`: `InStock` dla `Dostępny`, `PreOrder` dla `Na zamówienie`, `OutOfStock` dla `Niedostępny`
- [x] `Na zamówienie` wymusza cenę `Cena na zapytanie` i nie emituje publicznej ceny w JSON-LD
- [x] `Niedostępny` pokazuje jawny status i zachowuje ostatnią znaną cenę publiczną, jeśli była podana
- [x] Karta produktu EN/UA ma osobne tłumaczenia dla `Na zamówienie` i `Niedostępny`
- [x] `product-card.tsx`: brak line-through i brak udawania, że `Niedostępny` oznacza zamówienie
- [x] `lib/i18n.ts`: `unavailableSourcing` oznacza teraz `Na zamówienie`, a `unavailable` oznacza `Niedostępny`
- [x] Sitemap zawiera wszystkie produkty bez względu na status (priority 0.7)
- [x] Grep `sprzedan|sold|discontinued` w kodzie aplikacji → zero wystąpień
- [x] Legacy `Zarezerwowany` usunięty z publicznego kontraktu produktu

### Etap 7 — Hardening SEO/UX
- [x] Preconnect + dns-prefetch do hosta z `NEXT_PUBLIC_CDN_BASE_URL` w root layout
- [x] README przepisany pod nową architekturę (struktura, deploy, CMS_MODE, sekrety GitHub)
- [x] `.env.example` przepisany (CMS_MODE, CMS_API_URL, CMS_API_TOKEN, NEXT_PUBLIC_CDN_BASE_URL, NEXT_PUBLIC_PRIVATE_COLLECTION_CODE)
- [x] `IMAGES-CDN.md` — pełna instrukcja migracji obrazów do R2

### Stan techniczny
- [x] `npm run dev` — strona startuje, 65 produktów z atrapy, formularze logują do konsoli
- [x] `npm run build` — generuje `out/` z **300 statycznych stron** (PL + EN + UA + produkty + landingi)
- [x] TypeScript `npm run lint` — czysto (exit 0)

---

## 🔧 POZOSTAŁO W REPO (drobne, można zrobić w tygodniu)

Lista uzupełnień planowanych w Etapie 7 (hardening), niezablokujących wdrożenia:

- [ ] **`BreadcrumbList` JSON-LD** — uzupełnić w pozostałych landing pages (część jest, audyt który ma a który nie)
- [ ] **Lazy-load mapy Google** na `/kontakt` (intersection observer + iframe injection) — dziś mapa ładuje się od razu
- [ ] **Kompresja `public/rolex.mp4`** — wygenerować WebM/AV1 + poster, aktualnie surowy MP4
- [ ] **Plausible / Umami** — wkleić skrypt analytics w `<head>`
- [ ] **Lighthouse baseline** — uruchomić audit 3 stron (homepage / produkt / landing) i zapisać wyniki w `docs/lighthouse-baseline.md` (żeby przyszłe regresje były widać)

---

## 🌐 ZEWNĘTRZNY SETUP (przed pierwszym deployem produkcyjnym)

Nie da się tego zrobić tylko zmianą kodu — wymaga kont w usługach zewnętrznych.

### 1. Hostinger Business — FTP credentials
- [ ] Zaloguj się do panelu Hostingera → **Files** → **FTP Accounts**
- [ ] Zanotuj `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`
- [ ] W GitHub repo → **Settings** → **Secrets and variables** → **Actions** dodaj te 3 sekrety
- [ ] Sprawdź, że `public_html/` w panelu Hostingera jest pusty (lub zaakceptuj że deploy nadpisze stary content)

### 2. Cloudflare R2 + CDN obrazów (opisane w [IMAGES-CDN.md](IMAGES-CDN.md))
- [ ] Załóż konto Cloudflare, utwórz bucket `R2_PRODUCTS_BUCKET` z [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md)
- [ ] Skonfiguruj custom domain `CMS_CDN_HOST` (CNAME w DNS Cloudflare)
- [ ] Uruchom skrypt upload `public/products/**` → R2 (sample w `IMAGES-CDN.md`)
- [ ] (Opcjonalnie) Pre-generuj warianty WebP w 3 rozmiarach (thumb/medium/full)
- [ ] Zaktualizuj `from-cms/fixtures/products.json` — `images: [...]` z absolute URL-ami CDN
- [ ] `git rm -r public/products` — schudnij repo o setki MB

### 3. CMS (Twoja osobna aplikacja, planowana przez Ciebie)
Specyfikacja minimum dla strony jest w `ARCHITECTURE-REVIEW.md` checklista 2 (sekcje A–H). Skrócony zarys:

- [ ] Endpoint `GET /api/v1/products` zwracający JSON zgodny z `from-cms/schemas/product.ts` (zod)
- [ ] Endpoint `POST /api/v1/leads` przyjmujący body zgodne z `from-cms/schemas/lead.ts` + CORS dla `warszawskiczas.pl`
- [ ] Endpoint `GET /api/v1/translations?locale=...` (opcjonalny, dla bundle UI)
- [ ] Trigger do GitHub `repository_dispatch` (`event_type: cms-publish`) dopiero z punktu kontrolnego publikacji, po zapisaniu snapshotu
- [ ] Bezpieczeństwo: API token read-only, rate limit, 2FA dla adminów, audit log
- [ ] Auto-tłumaczenia PL → EN/UA (DeepL/Google + glosariusz terminów branżowych)

### 4. Po wdrożeniu CMS — cutover (1 dzień)
- [ ] W GitHub Secrets dodaj `CMS_MODE=live`, `CMS_API_URL`, `CMS_API_TOKEN`
- [ ] (Opcjonalnie) testowy lokalny build z `CMS_MODE=live` — sprawdź czy walidacja zod nie protestuje
- [ ] Trigger ręczny `workflow_dispatch` w GitHub Actions
- [ ] Sprawdź że strona produkcyjna pokazuje produkty z CMS (zmień status testowego produktu → strona pokaże po max 5 min)
- [ ] Sprawdź że formularz kontaktowy ląduje w CMS i wysyła mail

---

## 📋 CHECKLIST SANITY PRZED DEPLOY-EM PRODUKCYJNYM

Lista do przejścia w głowie tuż przed pierwszym pushem na `main`:

- [ ] `npm run dev` lokalnie — wszystkie sekcje strony działają, formularze "udają wysłanie"
- [ ] `npm run build` — exit 0, ~300 stron w `out/`
- [ ] `npx serve out` — strona statyczna działa, klikalna
- [ ] Sprawdź view-source 3 stron (home, produkt, landing) — `<link rel="alternate" hreflang>`, JSON-LD, canonical
- [ ] Sprawdź statusy: `Na zamówienie` ma JSON-LD `PreOrder` i cenę na zapytanie; `Niedostępny` ma JSON-LD `OutOfStock` i ostatnią znaną cenę
- [ ] Hostinger FTP sekrety w GitHub Actions
- [ ] DNS domeny `warszawskiczas.pl` wskazuje na Hostinger (już powinien)
- [ ] `public/.htaccess` zostanie wgrany (sprawdź że plik jest w `out/.htaccess` po buildzie)

---

## Słownik decyzji

| Pytanie | Decyzja | Gdzie zapisane |
|---|---|---|
| Hosting | Hostinger Business (statyczny) — już opłacone | next.config.js + .htaccess |
| CMS | własna aplikacja od zera, osobny projekt | kontrakt: from-cms/schemas |
| Obrazy | Cloudflare R2 + `CMS_CDN_HOST` | IMAGES-CDN.md + CMS-CRM-ENVIRONMENT.md |
| Statusy produktów | `Dostępny`=`InStock`, `Na zamówienie`=`PreOrder` + cena na zapytanie, `Niedostępny`=`OutOfStock` + ostatnia znana cena | lib/product-availability.ts, produkty/[slug]/page.tsx, product-card.tsx |
| URL i18n | subfolder per locale (`/`, `/en/`, `/ua/`), translated slugs | lib/i18n.ts SEGMENT_TRANSLATIONS |
| Auto-tłumaczenia | po stronie CMS (DeepL + Google, human-in-the-loop) | ARCHITECTURE-REVIEW.md sekcja H |
| Bramka kodowa Private Collection | klient-side (`NEXT_PUBLIC_PRIVATE_COLLECTION_CODE`), teaser, nie zabezpieczenie | private-collection-{featured,gallery,registration}.tsx |
| `private-collection-registration` | zwykły lead `type=inquiry`, źródło `kolekcja-prywatna` | from-cms/schemas/lead.ts |
| Lead webhook spec | zod schema = SSOT, CMS musi spełnić ten kontrakt | from-cms/schemas/lead.ts |
