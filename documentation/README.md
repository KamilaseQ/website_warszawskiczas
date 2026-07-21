# Warszawski Czas — dokumentacja projektu

> Stan architektury: 2026-07-21.

Strona `warszawskiczas.pl` jest aplikacją Next.js 15 uruchamianą jako serwer Node.js na Hostingerze. Publiczna witryna pobiera produkty z osobnego CMS-u, a formularz kontaktowy korzysta z lokalnego Route Handlera i SMTP.

## Aktualna architektura

- **Frontend:** Next.js 15 App Router + React 19 + TypeScript.
- **Runtime produkcyjny:** `next build` + `next start`; projekt nie używa już `output: 'export'`.
- **Hosting:** Hostinger Business z procesem Node.js.
- **Produkty:** `from-cms/adapters/products.ts`; tryb `mock` z fixtures lub `live` przez HTTPS.
- **Formularz kontaktowy:** `app/api/contact/route.ts` + `lib/contact/*` + SMTP.
- **Leady/WhatsApp:** publiczny endpoint aplikacji CMS konfigurowany przez `NEXT_PUBLIC_CMS_LEAD_URL`.
- **Obrazy produktów:** zewnętrzny CDN (`cdn.camalio.pl`) oraz lokalne fixtures w trybie mock.
- **Języki:** PL pod `/`, EN pod `/en`, UA pod `/ua`; wersje EN/UA są prerenderowane przez `app/(public)/[locale]/[[...path]]/page.tsx`.
- **Deploy:** Hostinger pobiera repozytorium i buduje aplikację. GitHub Actions wykonuje niezależny build i kontrole jakości, ale nie wysyła plików przez FTP.

Szczegóły hostingu znajdują się w [HOSTINGER-DEPLOYMENT.md](HOSTINGER-DEPLOYMENT.md), a granica z CMS-em w [FROM-CMS-BOUNDARY.md](FROM-CMS-BOUNDARY.md).

## Wymagania

- Node.js 20 (wersja używana przez CI),
- npm,
- opcjonalnie dane CMS/SMTP w lokalnych plikach `.env*`.

## Praca lokalna

```bash
npm ci
npm run dev
```

Domyślnie, bez `CMS_MODE=live`, adapter produktów korzysta z `from-cms/fixtures/products.json`.

## Kontrole przed commitem

Pełna kontrola lokalna:

```bash
npm run verify
```

Polecenie wykonuje kolejno:

1. typecheck,
2. produkcyjny build Next.js,
3. uruchomienie lokalnego `next start`,
4. crawl wszystkich URL-i z lokalnej sitemapy,
5. walidację canonical, hreflang, linków, obrazów i JSON-LD.

Jeżeli build już istnieje, wystarczy:

```bash
npm run verify:seo
```

Kontrole cząstkowe wymagają działającego serwera pod `http://localhost:3000` albo ustawienia `CHECK_BASE_URL`:

```bash
npm run check:seo
npm run check:links
npm run check:images
npm run check:product-urls
```

Dokładne reguły i sposób obsługi znanych problemów opisuje [SEO-QUALITY-GATES.md](SEO-QUALITY-GATES.md).

## Build i uruchomienie produkcyjne

```bash
npm run build
npm run start
```

Artefaktem jest katalog `.next/`. Katalog `out/` i konfiguracja `.htaccess` nie są częścią aktualnej ścieżki wdrożeniowej.

## Najważniejsze katalogi

```text
app/                 App Router, metadata, sitemap, robots i API
components/          komponenty UI, sekcje, formularze i nawigacja
from-cms/            schematy i adaptery granicy strona ↔ CMS
lib/                 i18n, SEO, dane strukturalne i integracje
scripts/             build helpers i automatyczne kontrole jakości
documentation/       aktualna dokumentacja operacyjna
memory/              krótkie notatki projektowe i decyzje historyczne
```

## Zasada aktualności dokumentacji

Zmiana architektury, sposobu deployu, polityki indeksowania albo kontraktu CMS musi aktualizować odpowiedni dokument w tym samym commicie. Dokument historyczny powinien być oznaczony jako historyczny; nie może udawać bieżącej instrukcji operacyjnej.
