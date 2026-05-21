# CMS/CRM - źródło prawdy środowiska

> Status: dokument operacyjny  
> Data: 2026-05-20  
> Cel: jedno miejsce do zmiany hostów, jurysdykcji danych i nazw zasobów Cloudflare.

Ten plik jest źródłem prawdy dla adresów i ustawień środowiska aplikacji `app_warszawskiczas`. Plan i checklista nie powinny utrzymywać własnych kopii domen poza tym plikiem.

## Domeny

Publiczna strona zostaje na:

- `PUBLIC_WEBSITE_ORIGIN=https://warszawskiczas.pl`
- `PUBLIC_WEBSITE_WWW_ORIGIN=https://www.warszawskiczas.pl`

Aplikacja CMS/CRM działa tymczasowo na subdomenach `camalio.pl`:

- `APP_BASE_DOMAIN=camalio.pl`
- `CMS_APP_HOST=app.camalio.pl`
- `CMS_API_HOST=api.camalio.pl`
- `CMS_CDN_HOST=cdn.camalio.pl`

Adresy wynikowe:

- `CMS_APP_ORIGIN=https://app.camalio.pl`
- `CMS_API_ORIGIN=https://api.camalio.pl`
- `CMS_CDN_ORIGIN=https://cdn.camalio.pl`
- `NEXT_PUBLIC_CMS_LEAD_URL=https://api.camalio.pl/api/v1/leads`
- `CMS_API_URL=https://api.camalio.pl`

Zmiana domeny w przyszłości powinna polegać na podmianie wartości w tej sekcji i przepisaniu konfiguracji DNS/Cloudflare, bez szukania domen po całych dokumentach.

## Cloudflare

Zasoby:

- `D1_DATABASE_NAME=warszawskiczas-cms`
- `D1_TEST_DATABASE_NAME=warszawskiczas-cms-test`
- `R2_PRODUCTS_BUCKET=warszawskiczas-products`

Lokalizacja danych:

- `CLOUDFLARE_JURISDICTION=eu`
- preferowany location hint, tylko jeśli dany produkt/ekran Cloudflare pozwala użyć go bez konfliktu z jurysdykcją: `eeur`
- fallback dla location hint: `weur`
- jeśli Cloudflare pokazuje wybór po miastach, wybieramy Frankfurt zamiast Londynu

Uzasadnienie:

- Cloudflare D1 i R2 mają formalny mechanizm jurysdykcji `eu`; ustawiamy go przy tworzeniu, bo później nie można go zmienić.
- Dla Warszawy preferowany hint to `eeur`, bo większość pracy i zapisu danych będzie wykonywana z Polski. W D1 jurysdykcja ma pierwszeństwo nad location hint, więc hint traktujemy jako preferencję wydajnościową, nie wymóg zgodności.
- Jeśli panel daje tylko wybór między Frankfurtem i Londynem, Frankfurt jest bliżej Warszawy i pozostaje w UE; Londyn nie jest preferowany dla danych objętych założeniem EU/GDPR.

## Deployment

Runtime aplikacji:

- Next.js 15 + React 19 + TypeScript
- Cloudflare Workers runtime przez `@opennextjs/cloudflare`
- `nodejs_compat` w konfiguracji Workera
- Hono może być użyte dla API, ale routing powinien być wystawiony pod `CMS_API_HOST`

Auth:

- Cloudflare Access chroni `CMS_APP_HOST`
- Cloudflare Access chroni endpointy wewnętrzne na `CMS_API_HOST`
- publiczne wyjątki API: `/api/v1/leads`, `/api/v1/products`, `/api/v1/translations`, `/api/v1/publish/callback`
- publiczne endpointy nadal mają własne zabezpieczenia: CORS allowlist, rate limit, token/secret tam, gdzie dotyczy
