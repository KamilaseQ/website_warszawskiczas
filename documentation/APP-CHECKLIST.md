# Checklista wdrożenia aplikacji CMS/CRM/APP - Warszawski Czas

Dokument operacyjny. Każdy slice ma własną sekcję z zakresem, testami automatycznymi, walidacją manualną i Definition of Done. Powiązany SSOT funkcjonalny: [CMS-CRM-APP-PLAN.md](CMS-CRM-APP-PLAN.md) sekcje 21, 23, 24. Środowisko, hosty i lokalizacja danych: [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md).

**Metodologia:** walking skeleton + vertical slices. Każdy slice deployowalny na produkcję, widoczny na telefonie, z testami i checklistą walidacji.

## Status bieżący

> Aktualizacja: 2026-05-21. Ten plik jest kopią checklisty operacyjnej trzymaną w repo strony, żeby deploy strony nie rozjechał się z CMS/CRM.

- [x] CMS/CRM działa na `https://app.camalio.pl`.
- [x] Publiczne API CMS działa na `https://api.camalio.pl`.
- [x] `POST https://api.camalio.pl/api/v1/leads` zapisuje poprawny lead do D1.
- [x] CORS API CMS przepuszcza `https://demowarszawskiczas.vercel.app`, `https://warszawskiczas.pl`, `https://www.warszawskiczas.pl`.
- [x] Repo strony ma `NEXT_PUBLIC_CMS_LEAD_URL=https://api.camalio.pl/api/v1/leads` w konfiguracji builda i `.env.example`.
- [x] Aktualny live bundle Vercel został sprawdzony po redeployu i zawiera endpoint CMS.
- [x] Vercel demo `https://demowarszawskiczas.vercel.app` jest przebudowane z `NEXT_PUBLIC_CMS_LEAD_URL`.
- [x] Pierwszy lead z formularza demo strony jest widoczny w PWA.

**Założenia bazowe (potwierdzone):**
- Hosting aplikacji na Cloudflare Workers + D1 + R2 + Access; hosty z `CMS-CRM-ENVIRONMENT.md`
- Status produktu: `Dostępny` / `Na zamówienie`
- Punkt kontrolny publikacji (nie kolejka zmian) - diff względem ostatniego snapshotu + jedno kliknięcie
- Treści landingów zostają w kodzie strony (rzadko zmieniane, nie idą do CMS)
- Powiadomienia, audit log, role, RODO formalne, backup D1: po MVP
- Rolki: tylko scenariusze, bez storage filmów
- Pełny rebuild po każdej publikacji - akceptowalne
- UI po polsku, nazwa: `Rolki` (DB technicznie `reel_scenarios`)
- Testy pisane równolegle z implementacją, w osobnej sekcji `tests/`, każdy z komentarzem co i dlaczego sprawdza

---

## Slice 0 - Walking skeleton (1-2 dni)

**Cel:** PWA zainstalowana na iPhonie, chroniona Cloudflare Access, pokazuje "Hello [imię]".

### Setup Cloudflare

- [ ] Utworzyć repo `app_warszawskiczas` na GitHubie
- [ ] Lokalizacja lokalna: `C:\Users\212ka\source\repos\app_warszawskiczas`
- [ ] Dodać domenę `APP_BASE_DOMAIN` z [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md) do Cloudflare (DNS przez CF jako proxy) - jeśli jeszcze nie
- [ ] Skonfigurować hosty z dokumentu środowiska:
  - [ ] `CMS_APP_HOST` -> Cloudflare Worker z aplikacją Next.js
  - [ ] `CMS_API_HOST` -> Cloudflare Worker/API route dla endpointów CMS
  - [ ] `CMS_CDN_HOST` -> R2 custom domain
- [ ] Utworzyć bucket R2 `R2_PRODUCTS_BUCKET` z jurysdykcją `CLOUDFLARE_JURISDICTION=eu`
- [ ] Utworzyć bazę D1 `D1_DATABASE_NAME` z `--jurisdiction=eu`; jeśli Cloudflare dodatkowo pyta o location hint bez konfliktu z jurysdykcją, wybrać `eeur`, fallback `weur`; jeśli wybór jest po miastach, Frankfurt zamiast Londynu
- [ ] Utworzyć osobną bazę D1 `D1_TEST_DATABASE_NAME` dla testów z tymi samymi zasadami lokalizacji
- [ ] Skonfigurować Cloudflare Access:
  - [ ] Aplikacja Self-hosted dla `CMS_APP_HOST`
  - [ ] Nie zakładać Access na całe `CMS_API_HOST`; publiczne API musi obsługiwać formularze strony bez logowania
  - [ ] Endpointy wewnętrzne `/internal/*` udostępniać przez `CMS_APP_HOST`, czyli przez host panelu chroniony Access
  - [ ] Identity provider: One-time PIN (e-mail)
  - [ ] Session duration: 1 miesiąc
  - [ ] Allowlist: można zacząć od 1 maila; pozostałe 2 dodać później bez migracji i bez zmiany kodu
- [ ] Wygenerować CF API Token z uprawnieniami Workers/D1/R2 -> GitHub Secrets
- [ ] Zainstalować wrangler lokalnie (`npm install -D wrangler` w repo + `npx wrangler login`)

### Fundament aplikacji

- [ ] `create-next-app` z TypeScript, App Router, Tailwind
- [ ] `@opennextjs/cloudflare` jako adapter Next.js na Cloudflare Workers
- [ ] `wrangler.toml` albo `wrangler.jsonc` z bindingami: D1 `D1_DATABASE_NAME`, R2 `R2_PRODUCTS_BUCKET`, `nodejs_compat`
- [ ] Hono router albo route handler w Workerze, endpoint `GET /api/v1/health` zwraca 200 + nazwę zalogowanego usera (z nagłówka `Cf-Access-Authenticated-User-Email`)
- [ ] PWA manifest (`manifest.json`):
  - [ ] Nazwa: "WarszawskiCzas"
  - [ ] Kolory marki
  - [ ] Ikony 192x192 i 512x512 (czarno-białe, ze złotym akcentem)
  - [ ] `display: standalone`
  - [ ] Apple meta tagi w `<head>` (`apple-mobile-web-app-capable`, `apple-touch-icon`)
- [ ] Service worker (minimal: cache shell + offline fallback)
- [ ] Design system - komponenty bazowe (Button, Input, Card)
- [ ] Routing: `/` (start z imieniem), `/login` (przekierowanie do Access jeśli niezalogowany)

### Testy automatyczne

- [ ] Setup `vitest` + `@cloudflare/vitest-pool-workers`
- [ ] Folder `tests/` ze strukturą zgodną z sekcją 23 planu
- [ ] `tests/integration/health.test.ts` - "GET /api/v1/health zwraca 200 i nazwę zalogowanego użytkownika z nagłówka Access"
- [ ] `tests/integration/access.test.ts` - "Endpointy wewnętrzne zwracają 401 bez nagłówka Cf-Access-Jwt-Assertion"
- [ ] CI w GitHub Actions: `vitest run` + `tsc --noEmit` + `wrangler deploy --dry-run`

### Walidacja manualna - `tests/manual/slice-0.md`

- [ ] Plik `tests/manual/slice-0.md` istnieje z szablonem (golden path / try to break it / performance / raport)
- [ ] Otwarcie `CMS_APP_ORIGIN` na iPhonie -> ekran logowania CF Access
- [ ] Po wpisaniu kodu z maila widać swoje imię
- [ ] Można dodać aplikację do ekranu głównego iPhone'a (Share -> Add to Home Screen)
- [ ] Po zamknięciu i ponownym otwarciu PWA - nadal zalogowany
- [ ] Próba wejścia z maila spoza allowlisty -> 403

### Definition of Done

- [ ] PWA zainstalowana na iPhonie właściciela
- [ ] Wszystkie testy slice 0 przechodzą
- [ ] Plik `tests/manual/slice-0.md` ma wypełniony raport
- [ ] Commit + deploy na produkcję

---

## Slice 1 - Lead capture (2-4 dni)

**Cel:** Lead z formularza warszawskiczas.pl trafia do D1 i jest widoczny w PWA (read-only).

### D1 + API

- [x] Migracja 0001: tabela `leads` (pełen kształt z sekcji 18 planu)
- [x] Indeks `leads.status`, `leads.created_at DESC`, `leads.product_id`
- [x] Endpoint publiczny `POST /api/v1/leads`:
  - [x] CORS allowlist: `demowarszawskiczas.vercel.app`, `warszawskiczas.pl`, `www.warszawskiczas.pl`
  - [x] Honeypot check (pole `company`)
  - [x] Walidacja Zod (`LeadPayloadSchema` zgodna z istniejącym `from-cms/schemas/lead.ts`)
  - [x] Rate limit: max 5 requestów/minutę/IP
  - [x] Zapis do D1 ze statusem `Do kontaktu`
  - [x] Zwrot 200 z `{ok: true}` (bez ID leada, żeby nie wycieknąć info)
- [x] Endpoint wewnętrzny `GET /internal/leads` (chroniony Access):
  - [x] Sortowanie: najnowsze pierwsze
  - [x] Paginacja (limit 50, offset)

### Frontend PWA

- [x] Ekran `/klienci` w PWA: lista leadów (read-only w tym slice)
- [x] Karta leada na liście: imię/telefon, status, czas od utworzenia, źródło
- [ ] Pull-to-refresh
- [x] Pusty stan: "Brak leadów - poczekaj na pierwsze zapytanie"

### Integracja ze stroną

- [x] Aktualizacja env strony: `NEXT_PUBLIC_CMS_LEAD_URL` zgodnie z [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md)
- [x] Test lokalny strony z nowym endpointem leadów (`CMS_MODE=mock` dla produktów)
- [x] Redeploy demo strony na Vercel z `NEXT_PUBLIC_CMS_LEAD_URL`
- [ ] Wszystkie 3 formularze strony trafiają do CMS: kontakt (`type=contact`), zapytanie produktowe (`type=inquiry`), kolekcja na zapytanie (`type=inquiry`, `source=kolekcja-prywatna`)

### Testy automatyczne

- [ ] `tests/unit/schemas/lead.test.ts` - "Zod schema akceptuje payload strony, odrzuca payload bez telefonu, odrzuca payload z honeypot"
- [ ] `tests/integration/leads-post.test.ts` - "POST /api/v1/leads z poprawnym payloadem zapisuje do D1 i zwraca 200"
- [ ] `tests/integration/leads-post-honeypot.test.ts` - "POST z polem honeypot zwraca 400 i NIC nie zapisuje (sprawdzić COUNT)"
- [ ] `tests/integration/leads-post-validation.test.ts` - "POST bez wymaganego telefonu zwraca 400 z czytelnym komunikatem"
- [ ] `tests/integration/leads-rate-limit.test.ts` - "6 requestów w 60 sekund z tego samego IP - 6-ty zwraca 429"
- [ ] `tests/integration/leads-list.test.ts` - "GET /internal/leads zwraca leady posortowane od najnowszego, z paginacją"
- [ ] `tests/integration/leads-cors.test.ts` - "POST z Origin warszawskiczas.pl przechodzi CORS, z innego Origin nie"

### Walidacja manualna - `tests/manual/slice-1.md`

- [ ] Plik istnieje z szablonem
- [ ] Golden path:
  - [ ] Wypełnić formularz `/kontakt` na produkcji - lead widoczny w PWA w mniej niż 5 sekund
  - [ ] Wypełnić formularz z karty produktu - lead ma poprawny `product_id`
  - [ ] Wypełnić formularz kolekcji na zapytanie - lead ma poprawne źródło `kolekcja-prywatna`
- [ ] Try to break it:
  - [ ] Wysłać 10 leadów w 30 sekund - 11-ty zwraca 429
  - [ ] Wysłać payload z `company` (honeypot wypełniony) - nie pojawia się w PWA
  - [ ] Wysłać payload bez telefonu - 400, czytelny komunikat na stronie
  - [ ] Wysłać payload z innego Origin (curl) - CORS blokuje
- [ ] Performance:
  - [ ] Lead pojawia się w PWA w mniej niż 5s od submita
  - [ ] Lista 50 leadów ładuje się w mniej niż 1s

### Definition of Done

- [ ] Wszystkie testy automatyczne przechodzą
- [ ] Plik walidacji manualnej z wypełnionym raportem
- [ ] Strona warszawskiczas.pl na produkcji wysyła leady do CMS
- [ ] Co najmniej 1 prawdziwy lead w D1

---

## Slice 2 - Lead management (3-5 dni)

**Cel:** Mogę z telefonu zarządzać leadami (status, notatka, follow-up).

### D1 + API

- [ ] Migracja 0002: kolumny `note`, `close_reason`, `closed_at` w `leads`; tabela `followups`; indeks `followups.due_at`
- [ ] `PATCH /internal/leads/:id` - aktualizuje status, notatkę, powód zamknięcia, timestamp `updated_at`, `updated_by`
- [ ] `POST /internal/followups` - tworzy follow-up dla leada
- [ ] `PATCH /internal/followups/:id/done` - oznacza wykonany (`done_at = now()`)
- [ ] `GET /internal/followups/today` - follow-upy z `due_at` na dziś, niewykonane
- [ ] `GET /internal/followups/overdue` - follow-upy zaległe (`due_at < today`, niewykonane)
- [ ] Helper dat: konwersja "jutro", "za 3 dni", "za 7 dni" w strefie Europe/Warsaw (uwzględnić DST)

### Frontend PWA

- [ ] Karta leada `/klienci/[id]`:
  - [ ] Telefon klikalny `tel:`
  - [ ] E-mail klikalny `mailto:`
  - [ ] Status dropdown (Do kontaktu / W trakcie / Follow-up / Zakończono)
  - [ ] Notatka textarea z autosave (debounce 1s)
  - [ ] Sekcja follow-upów: lista istniejących + przycisk "Dodaj follow-up"
  - [ ] Modal dodawania follow-upu: szybkie buttony (jutro/za 3 dni/za 7 dni/data) + notatka
  - [ ] Przy zmianie statusu na `Zakończono`: bottom sheet z powodami
  - [ ] Akcje na dole: "Zadzwoń" (tel:), "Follow-up", "Zamknij"
- [ ] Lista leadów: swipe right -> "Zadzwoń", swipe left -> "Follow-up"
- [ ] Ekran startowy `/`:
  - [ ] Sekcja "Nowe leady" (status `Do kontaktu`, ostatnie 7 dni) - tylko jeśli są
  - [ ] Sekcja "Follow-upy na dziś" - tylko jeśli są
  - [ ] Sekcja "Zaległe follow-upy" (czerwone) - tylko jeśli są

### Testy automatyczne

- [ ] `tests/integration/lead-status-change.test.ts` - "PATCH /internal/leads/:id zmienia status i zapisuje timestamp + updated_by"
- [ ] `tests/integration/lead-note-autosave.test.ts` - "PATCH /internal/leads/:id z samą notatką zapisuje tylko notatkę, nie zmienia statusu"
- [ ] `tests/integration/followup-create.test.ts` - "POST /internal/followups z 'jutro' tworzy follow-up z due_at = jutro o 09:00 w strefie Warsaw"
- [ ] `tests/integration/followup-overdue.test.ts` - "GET /internal/followups/overdue zwraca tylko zaległe niewykonane"
- [ ] `tests/integration/followup-done.test.ts` - "PATCH /internal/followups/:id/done ustawia done_at = now()"
- [ ] `tests/unit/dates.test.ts` - "helper 'za 3 dni' przy zmianie DST (28-30 marca) liczy poprawnie 3 dni kalendarzowe"
- [ ] `tests/unit/dates.test.ts` - "helper 'za 7 dni' przy końcu miesiąca przechodzi do następnego miesiąca"

### Walidacja manualna - `tests/manual/slice-2.md`

- [ ] Golden path:
  - [ ] Lead z formularza -> zmiana statusu na `W trakcie` -> notatka -> follow-up jutro
  - [ ] Jutro o 9:00 sprawdzić dashboard - lead w "Follow-upy na dziś"
  - [ ] Kliknąć "Zadzwoń" - telefon dzwoni
  - [ ] Po rozmowie - oznaczyć follow-up jako wykonany
  - [ ] Zamknąć leada z powodem `Sprzedaż`
- [ ] Try to break it:
  - [ ] Notatka 5000 znaków - co się dzieje?
  - [ ] Dwa follow-upy na ten sam dzień - oba widoczne?
  - [ ] Notatka z emoji / polskimi znakami - zapisana poprawnie?
- [ ] 7-dniowy test w realnej pracy butiku: prowadzę 3 leady od kontaktu do zamknięcia, nic mi nie umyka

### Definition of Done

- [ ] Wszystkie testy przechodzą
- [ ] Walidacja manualna zakończona, raport wypełniony
- [ ] 3 prawdziwe leady doprowadzone do statusu `Zakończono` przez aplikację

---

## Slice 3 - Products read-only (3-5 dni)

**Cel:** 65 produktów w D1, widoczne w PWA. Strona nadal z fixtures.

### D1 + skrypty migracji

- [ ] Migracja 0003: `products`, `product_images`, `product_translations` (zgodnie z sekcją 18 planu)
- [ ] Indeks `products.slug` UNIQUE, `products.visibility`, `products.brand`
- [ ] Skrypt `scripts/import-products.ts`:
  - [ ] Czyta `from-cms/fixtures/products.json` ze strony
  - [ ] Mapuje status: `Niedostępny` -> `Na zamówienie`, `Zarezerwowany` -> `Dostępny` + `visibility: Ukryty`, `Dostępny` -> bez zmian
  - [ ] Generuje slug jeśli brak
  - [ ] Wstawia tłumaczenia PL/EN/UA jeśli istnieją w fixtures
  - [ ] Idempotentny (powtórne uruchomienie nie duplikuje)
- [ ] Skrypt `scripts/upload-images.ts`:
  - [ ] Przesyła `website_warszawskiczas/public/products/**` do R2 z zachowaniem struktury folderów
  - [ ] Aktualizuje URL-e w `product_images` na `CMS_CDN_ORIGIN/...`
  - [ ] Idempotentny

### API

- [ ] `GET /internal/products` z parametrami: `category`, `brand`, `availability`, `visibility`, `q` (search), paginacja
- [ ] `GET /internal/products/:id` - pełne dane produktu z obrazami i tłumaczeniami

### Frontend PWA

- [ ] Ekran `/produkty`:
  - [ ] Lista z miniaturami z `CMS_CDN_HOST`
  - [ ] Search bar (debounce 300ms)
  - [ ] Bottom sheet z filtrami: kategoria, marka, dostępność, widoczność
  - [ ] Sortowanie: wyróżnione, cena rosnąco, cena malejąco, marka A-Z
  - [ ] Sticky pasek z liczbą wyników i filtrami
- [ ] Ekran `/produkty/[id]` (read-only podgląd):
  - [ ] Galeria zdjęć
  - [ ] Wszystkie pola produktu
  - [ ] Tłumaczenia PL/EN/UA (zakładki)
  - [ ] Brak edycji (przycisk "Edytuj" pojawi się w Slice 5)

### Testy automatyczne

- [ ] `tests/integration/import-products.test.ts` - "Skrypt import czyta 65 produktów z fixtures i zapisuje do D1 ze zmapowanymi statusami"
- [ ] `tests/integration/import-products-idempotent.test.ts` - "Drugie uruchomienie importu nie tworzy duplikatów"
- [ ] `tests/integration/products-list-internal.test.ts` - "GET /internal/products zwraca wszystkie, w tym ukryte"
- [ ] `tests/integration/products-filter-brand.test.ts` - "Filtr brand=Rolex zwraca tylko Rolexy"
- [ ] `tests/integration/products-search.test.ts` - "Search po referencji znajduje produkt po częściowym dopasowaniu"
- [ ] `tests/unit/schemas/product.test.ts` - "Zod schema akceptuje każdy z 65 zaimportowanych produktów"
- [ ] `tests/unit/mappers/status.test.ts` - "Mapper: Niedostępny -> Na zamówienie + visibility Publiczny"
- [ ] `tests/unit/mappers/status.test.ts` - "Mapper: Zarezerwowany -> Dostępny + visibility Ukryty"

### Walidacja manualna - `tests/manual/slice-3.md`

- [ ] Golden path:
  - [ ] Otwarcie `/produkty` - widać 65 zegarków z miniaturami
  - [ ] Filtr po marce Rolex - widać tylko Rolexy
  - [ ] Search "5711" - znajduje konkretny Patek Philippe
  - [ ] Kliknięcie na zegarek - pełne dane, wszystkie zdjęcia z `CMS_CDN_HOST`
- [ ] Try to break it:
  - [ ] Filtr bez wyników - widać komunikat "Brak produktów"
  - [ ] Search po pustym stringu - widać wszystkie
  - [ ] Skok do strony 10 paginacji - działa
- [ ] Performance:
  - [ ] Lista 65 produktów ładuje się w mniej niż 1.5s na 4G
  - [ ] Miniatury lazy-loaded (nie ładują się wszystkie naraz)

### Definition of Done

- [ ] 65 produktów w D1, wszystkie ze zmapowanymi nowymi statusami
- [ ] Wszystkie obrazy w R2, dostępne przez `CMS_CDN_HOST`
- [ ] Testy przechodzą
- [ ] Walidacja manualna OK

---

## Slice 4 - Migracja statusu na stronie (1 dzień, w repo strony)

**Cel:** Strona warszawskiczas.pl używa `Dostępny`/`Na zamówienie`.

### Zmiany w repo website_warszawskiczas

- [ ] Edycja [from-cms/schemas/product.ts](../from-cms/schemas/product.ts):
  - [ ] Enum `availability`: usunąć `Zarezerwowany`, `Niedostępny`; dodać `Na zamówienie`
- [ ] Mapowanie `from-cms/fixtures/products.json`:
  - [ ] Wszystkie `Niedostępny` -> `Na zamówienie`
  - [ ] Wszystkie `Zarezerwowany` -> `Dostępny` + ustawić `visibility: 'Ukryty'`
- [ ] Aktualizacja widoków:
  - [ ] Badge produktu w [app/(public)/produkty/[slug]/page.tsx](../app/(public)/produkty/[slug]/page.tsx)
  - [ ] JSON-LD `Offer.availability`: `InStock` dla `Dostępny`, `PreOrder` dla `Na zamówienie`
  - [ ] [lib/seo-product-filters.ts](../lib/seo-product-filters.ts)
  - [ ] Catch-all `[locale]/[[...path]]/page.tsx`
  - [ ] Tłumaczenia statusów PL/EN/UA (`Na zamówienie` / `Available on order` / `На замовлення`)
- [ ] `npm run build` lokalnie - przechodzi
- [ ] Smoke test lokalny: 5 losowych produktów ma poprawne badge i JSON-LD

### Testy automatyczne (w repo strony)

- [ ] `tests/integration/website-status-migration.test.ts` - "Build statycznego exportu przechodzi z nowym enumem"
- [ ] `tests/integration/website-jsonld.test.ts` - "Strona produktu Dostępny ma JSON-LD Offer.availability=InStock"
- [ ] `tests/integration/website-jsonld.test.ts` - "Strona produktu Na zamówienie ma JSON-LD Offer.availability=PreOrder"
- [ ] `tests/integration/website-sitemap.test.ts` - "Sitemap zawiera wszystkie produkty, w tym Na zamówienie"
- [ ] `tests/unit/status-mapping.test.ts` - "Żaden produkt z fixtures nie ma już statusu Zarezerwowany ani Niedostępny"

### Walidacja manualna - `tests/manual/slice-4.md`

- [ ] Golden path:
  - [ ] Deploy na produkcję
  - [ ] 3 losowe produkty na warszawskiczas.pl - nowe etykiety
  - [ ] Produkt "Na zamówienie" - tekst "Na zamówienie" (nie "Cena na zapytanie")
  - [ ] Produkt "Cena na zapytanie" (Dostępny) - tekst "Cena na zapytanie"
- [ ] Try to break it:
  - [ ] View-source: brak gdziekolwiek stringa "Zarezerwowany" lub "Niedostępny"
  - [ ] EN i UA wersje produktu mają przetłumaczony status
  - [ ] sitemap.xml zawiera URL-e produktów "Na zamówienie"

### Definition of Done

- [ ] Deploy strony zakończony
- [ ] Testy przechodzą
- [ ] Walidacja manualna OK
- [ ] Search Console nie zgłasza błędów strukturalnych (sprawdzić po 24h)

---

## Slice 5 - Products edit + R2 upload (5-7 dni)

**Cel:** Mogę z telefonu edytować zegarek, dodać zdjęcia, zmienić kolejność. Strona produkcyjna NIE zmienia się (zmiany czekają na Slice 6).

### API

- [ ] `POST /internal/products` - tworzy nowy produkt (walidacja Zod, generacja slug)
- [ ] `PATCH /internal/products/:id` - aktualizuje pola, zapisuje `updated_at`, `updated_by`
- [ ] `DELETE /internal/products/:id` - soft delete (`deleted_at`)
- [ ] `POST /internal/products/:id/images` - upload zdjęcia (presigned URL do R2 lub direct przez Worker)
- [ ] `PATCH /internal/products/:id/images/reorder` - aktualizacja `sort_order`
- [ ] `DELETE /internal/products/:id/images/:imageId` - usunięcie zdjęcia z R2 i D1
- [ ] Generowanie wariantów WebP (Cloudflare Images albo prosta resize) - decyzja przy implementacji

### Frontend PWA

- [ ] Ekran `/produkty/nowy`:
  - [ ] Wszystkie pola z sekcji 9.1 planu
  - [ ] Walidacja Zod w czasie rzeczywistym (błędy pod polem)
  - [ ] Sticky bottom button "Zapisz produkt"
- [ ] Ekran `/produkty/[id]/edytuj`:
  - [ ] Pre-wypełnione pola
  - [ ] Sekcja zdjęć: lista miniatur, drag-drop kolejności, przycisk "Dodaj zdjęcie"
  - [ ] Upload zdjęcia: aparat lub galeria iPhone
  - [ ] Walidacja zależności: "Na zamówienie" -> cena publiczna czyszczona, "Cena na zapytanie" -> ukryta cena
  - [ ] Toggle "Wyróżnij w katalogu" i "Kolekcja ekskluzywna"
  - [ ] Zakładki tłumaczeń PL/EN/UA
  - [ ] Checklista publikacji (sekcja 9.4 planu) jako wskaźnik
- [ ] Lista produktów: szybka edycja inline (cena, dostępność, widoczność)

### Testy automatyczne

- [ ] `tests/integration/product-create.test.ts` - "POST /internal/products z minimalnym setem pól tworzy produkt z slug i timestamps"
- [ ] `tests/integration/product-create-duplicate-slug.test.ts` - "POST z duplikatem slug zwraca 409"
- [ ] `tests/integration/product-update.test.ts` - "PATCH zmienia tylko podane pola"
- [ ] `tests/integration/product-validation-availability.test.ts` - "Na zamówienie + price publiczna -> walidator czyści price"
- [ ] `tests/integration/product-validation-price-on-request.test.ts` - "Cena na zapytanie - public price ukryta, ale dostępność Dostępny"
- [ ] `tests/integration/image-upload.test.ts` - "Upload zdjęcia zapisuje do R2 i tworzy rekord w product_images"
- [ ] `tests/integration/image-reorder.test.ts` - "PATCH reorder zachowuje spójność sort_order (bez duplikatów, bez dziur)"
- [ ] `tests/integration/image-delete.test.ts` - "DELETE zdjęcia usuwa z R2 i D1"
- [ ] `tests/integration/product-soft-delete.test.ts` - "DELETE ustawia deleted_at, produkt zniknął z GET list, ale jest w GET /trash"

### Walidacja manualna - `tests/manual/slice-5.md`

- [ ] Golden path:
  - [ ] Z telefonu w butiku dodaję nowy zegarek (Rolex Datejust) w mniej niż 3 minuty
  - [ ] Dodaję 5 zdjęć z aparatu
  - [ ] Zmieniam kolejność zdjęć przeciągnięciem
  - [ ] Ustawiam "Na zamówienie" - pole ceny się czyści automatycznie
  - [ ] Zapisuję - widzę w D1 (przez `wrangler d1 execute`)
  - [ ] Strona warszawskiczas.pl NIE pokazuje nowego zegarka (jeszcze nie kliknąłem publikacji)
- [ ] Try to break it:
  - [ ] Próba zapisania bez marki - błąd walidacji pod polem
  - [ ] Próba zapisania z ceną i `Na zamówienie` - cena znika
  - [ ] Upload zdjęcia 20MB - co się dzieje? Czy jest limit?
  - [ ] Edycja produktu na 2 urządzeniach - kto wygra?
- [ ] Performance:
  - [ ] Upload 1 zdjęcia (3-5MB) w mniej niż 10s na 4G
  - [ ] Save formularza w mniej niż 2s

### Definition of Done

- [ ] Testy przechodzą
- [ ] Co najmniej 3 produkty edytowane z telefonu
- [ ] Co najmniej 1 nowy produkt dodany z telefonu
- [ ] Zdjęcia w R2, URL-e w D1, ale strona produkcyjna niezmieniona

---

## Slice 6 - Punkt kontrolny publikacji (4-6 dni)

**Cel:** Klikam jeden przycisk, czekam ok. 3 minuty, widzę zmianę na warszawskiczas.pl.

### D1 + API

- [ ] Migracja 0004: tabele `publish_runs`, `publish_snapshots`
- [ ] `publish_snapshots` zawiera: `id`, `snapshot_hash`, `products_json` (cały stan opublikowanych produktów), `created_at`, `published_by`
- [ ] `publish_runs` zawiera: `id`, `snapshot_id`, `status` (Pending/Building/Success/Failed), `triggered_by`, `triggered_at`, `finished_at`, `github_run_url`, `error_message`
- [ ] `GET /internal/publish/diff` - liczy diff między obecnym stanem D1 a ostatnim opublikowanym snapshotem
- [ ] `POST /internal/publish` - tworzy snapshot, tworzy publish_run ze statusem `Pending`, triggeruje GH `repository_dispatch` (`event_type: cms-publish`) w repo strony, debounce 30s
- [ ] `POST /api/v1/publish/callback` - endpoint publiczny (z secret) dla GH Actions, aktualizuje status
- [ ] `GET /internal/publish/status/:runId` - polling dla frontu
- [ ] `POST /internal/publish/retry/:runId` - retry nieudanej publikacji

### Frontend PWA

- [ ] Ekran `/publikacja`:
  - [ ] Lista zmian z diff (dodane / zmienione - które pola / ukryte / odkryte / usunięte)
  - [ ] Czas od ostatniej publikacji
  - [ ] Status ostatniego buildu (zielony/czerwony/w trakcie)
  - [ ] Duży przycisk "Opublikuj zmiany na stronie"
  - [ ] Po kliknięciu: confirm dialog z liczbą zmian
  - [ ] Podczas buildu: spinner + tekst "Buduję stronę... (1-3 min)"
  - [ ] Po sukcesie: zielony check + link do strony
  - [ ] Po błędzie: czerwony X + przycisk "Ponów" + link do GH run
- [ ] Sekcja na ekranie startowym: status ostatniej publikacji

### Modyfikacja repo strony

- [ ] Edycja `.github/workflows/deploy.yml`:
  - [ ] Trigger `repository_dispatch` przyjmuje `{ run_id, snapshot_id }`
  - [ ] Build z `CMS_MODE=live`, env vars z secrets
  - [ ] Smoke test po deployu: `curl https://warszawskiczas.pl/sitemap.xml` zawiera >= 50 URL-i
  - [ ] Po deployu: callback `POST {CMS_API_ORIGIN}/api/v1/publish/callback` z `{ run_id, status, github_run_url }`
- [ ] GitHub Secrets:
  - [ ] `CMS_API_URL` zgodny z [CMS-CRM-ENVIRONMENT.md](CMS-CRM-ENVIRONMENT.md)
  - [ ] `CMS_API_TOKEN` (do `GET /api/v1/products`)
  - [ ] `CMS_CALLBACK_SECRET` (do callback)
- [ ] Cutover strony: zmienić `CMS_MODE` na `live` w GitHub Secrets

### Testy automatyczne

- [ ] `tests/integration/publish-diff-add.test.ts` - "Diff wykrywa nowy produkt w D1, którego nie ma w ostatnim snapshocie"
- [ ] `tests/integration/publish-diff-modify.test.ts` - "Diff wykrywa zmianę ceny produktu i wymienia 'price' jako zmienione pole"
- [ ] `tests/integration/publish-diff-hide.test.ts` - "Diff wykrywa produkt zmieniony z Publiczny na Ukryty"
- [ ] `tests/integration/publish-trigger.test.ts` - "POST /internal/publish triggeruje GH workflow przez mockowane API"
- [ ] `tests/integration/publish-debounce.test.ts` - "Drugi POST /internal/publish w ciągu 30s zwraca 409"
- [ ] `tests/integration/publish-callback.test.ts` - "Callback z status=success aktualizuje publish_run.status=Success i finished_at"
- [ ] `tests/integration/publish-callback-auth.test.ts` - "Callback bez secret zwraca 401"
- [ ] `tests/integration/publish-retry.test.ts` - "Retry nieudanej publikacji triggeruje nowy GH workflow"
- [ ] Smoke test w GH Actions strony: `tests/smoke/sitemap.sh` - sitemap zawiera min 50 URL-i

### Walidacja manualna - `tests/manual/slice-6.md`

- [ ] Golden path:
  - [ ] Zmieniam opis zegarka w PWA
  - [ ] Otwieram /publikacja - widzę "1 zmiana: edycja produktu X, pole: description"
  - [ ] Klikam "Opublikuj" - confirm dialog -> potwierdzam
  - [ ] Status zmienia się na "Building"
  - [ ] Po ok. 3 min status zmienia się na "Success"
  - [ ] Otwieram zegarek na warszawskiczas.pl - widzę nowy opis
- [ ] Ukrycie produktu:
  - [ ] Toggle visibility na Ukryty -> publikacja -> produkt znika ze strony
  - [ ] Sprawdzić, że strona produktu daje 404 (lub 410)
- [ ] Dodanie nowego:
  - [ ] Nowy zegarek z Slice 5 -> publikacja -> pojawia się na liście /produkty i ma własny URL
  - [ ] JSON-LD na nowym produkcie jest poprawny
- [ ] Try to break it:
  - [ ] Klikam "Opublikuj" 5 razy w ciągu 10s - drugi i kolejne zwracają 409
  - [ ] Wymuszam błąd buildu (np. niepoprawny obraz) - widzę "Failed" w PWA
  - [ ] Klikam "Ponów" - nowy build startuje
- [ ] Performance:
  - [ ] Czas publikacji (klik -> Success): pomierzyć, zapisać. Jeśli > 5 min, rozważyć optymalizację

### Definition of Done

- [ ] Testy przechodzą
- [ ] Co najmniej 3 udane publikacje
- [ ] Co najmniej 1 nieudana publikacja z udanym retry
- [ ] Strona warszawskiczas.pl na `CMS_MODE=live` dla produktów
- [ ] 65 produktów ze strony zostało pobranych z CMS-a, nie z fixtures

---

## Slice 7 - Kalendarz (2-3 dni)

**Cel:** Follow-upy klientów + własne wydarzenia w jednym widoku.

### D1 + API

- [ ] Migracja 0005: tabela `calendar_events`
- [ ] `GET /internal/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD` - merge follow-upów i custom events, sortowane chronologicznie
- [ ] `POST /internal/calendar-events`, `PATCH /internal/calendar-events/:id`, `DELETE /internal/calendar-events/:id`

### Frontend PWA

- [ ] Ekran `/kalendarz`:
  - [ ] Domyślny widok: lista chronologiczna (dziś, jutro, ten tydzień, w przyszłości)
  - [ ] Filtr: wszystko / tylko follow-upy / tylko wydarzenia
  - [ ] FAB "Dodaj wydarzenie"
- [ ] Modal dodawania wydarzenia: tytuł, data i godzina / całodniowe, notatka

### Testy automatyczne

- [ ] `tests/integration/calendar-merge.test.ts` - "GET /internal/calendar zwraca posortowany mix follow-upów i custom events"
- [ ] `tests/integration/calendar-event-create.test.ts` - "Tworzenie wydarzenia all_day=true zapisuje bez godziny"
- [ ] `tests/integration/calendar-range.test.ts` - "Zakres dat from-to filtruje poprawnie"

### Walidacja manualna - `tests/manual/slice-7.md`

- [ ] Dodaję wydarzenie "Spotkanie z klientem A, 2026-05-25, 14:00" - widoczne obok follow-upów na 25 maja
- [ ] Wydarzenie all_day=true - bez godziny w UI
- [ ] Usuwanie wydarzenia - znika z listy

### Definition of Done

- [ ] Testy przechodzą
- [ ] Walidacja manualna OK
- [ ] Co najmniej 1 prawdziwe wydarzenie + 1 follow-up widoczne razem

---

## Slice 8 - Rolki (2-3 dni)

**Cel:** Lista scenariuszy rolek z 4 statusami.

### D1 + API

- [ ] Migracja 0006: tabela `reel_scenarios` (nazwa techniczna pozostaje angielska, UI PL: `Rolki`)
- [ ] CRUD endpointy `/internal/reels`

### Frontend PWA

- [ ] Ekran `/rolki` z zakładkami statusów: Do weryfikacji / Do nagrania / Nagrane / Opublikowane
- [ ] Karta scenariusza: tekst, powiązany produkt (opcjonalny), notatka, status
- [ ] FAB "Nowy scenariusz"
- [ ] Akcje przesuwania między statusami (przyciski)

### Testy automatyczne

- [ ] `tests/integration/reel-create.test.ts` - "POST /internal/reels tworzy scenariusz w statusie Do weryfikacji"
- [ ] `tests/integration/reel-status-transition.test.ts` - "PATCH zmienia status, zapisuje reviewed_by i reviewed_at"
- [ ] `tests/integration/reel-with-product.test.ts` - "Scenariusz z product_id zachowuje powiązanie"

### Walidacja manualna - `tests/manual/slice-8.md`

- [ ] Tworzę 3 scenariusze
- [ ] Przesuwam jeden przez wszystkie statusy: Do weryfikacji -> Do nagrania -> Nagrane -> Opublikowane
- [ ] Filtruję widok po statusie - tylko właściwe widoczne

### Definition of Done

- [ ] Testy przechodzą
- [ ] Co najmniej 3 prawdziwe scenariusze rolek dodane

---

## Slice 9 - Statystyki operacyjne (1-2 dni)

**Cel:** Liczbowy przegląd biznesu na jednym ekranie.

### API

- [ ] `GET /internal/stats` zwraca:
  - [ ] Leady: nowe (7/30 dni), w kontakcie, zaległe follow-upy, zakończone (z breakdown po powodach)
  - [ ] Rolki: liczby per status
  - [ ] Produkty: publiczne, ukryte, na zamówienie, bez zdjęć, bez opisu

### Frontend PWA

- [ ] Ekran `/statystyki`:
  - [ ] 3 sekcje: Leady, Rolki, Produkty
  - [ ] Duże liczby, krótkie etykiety
  - [ ] Placeholder dla GA/GSC: "Połącz GA/GSC"

### Testy automatyczne

- [ ] `tests/integration/stats.test.ts` - "Liczby zgadzają się z bezpośrednim COUNT() na D1"
- [ ] `tests/integration/stats-after-mutation.test.ts` - "Po dodaniu leada liczba 'nowe' rośnie o 1"

### Walidacja manualna - `tests/manual/slice-9.md`

- [ ] Liczby zgadzają się z tym, co widzę w listach
- [ ] Po dodaniu leada liczba "nowe" rośnie

### Definition of Done

- [ ] Testy przechodzą
- [ ] Liczby zgodne z rzeczywistością

---

## Slice 10 - Treści placeholder + hardening (1-2 dni)

**Cel:** MVP gotowe do codziennego użycia produkcyjnego.

### Zakres

- [ ] Ekran `/tresci`: komunikat "Pracujemy nad tym modułem"
- [ ] Ekran `/powiadomienia`: placeholder
- [ ] Ekran `/ustawienia`:
  - [ ] Info o zalogowanym (imię, email)
  - [ ] Link "Wyloguj" (CF Access logout URL)
  - [ ] Wersja aplikacji
- [ ] `Ostatnia edycja: [imię], [data]` widoczne na każdym rekordzie z `updated_by` i `updated_at`
- [ ] README repo `app_warszawskiczas`:
  - [ ] Architektura w skrócie
  - [ ] Setup lokalny (wrangler login, env vars)
  - [ ] Jak deployować
  - [ ] Jak odpalać testy
- [ ] Runbook `documentation/runbook.md` w repo CMS:
  - [ ] Jak dodać nowego użytkownika do Cloudflare Access
  - [ ] Jak ponowić nieudaną publikację
  - [ ] Jak ręcznie wyeksportować leady do CSV (`wrangler d1 execute`)
  - [ ] Co zrobić gdy CF ma awarię (status.cloudflare.com)
- [ ] Pełny przegląd: golden path każdego modułu, naprawa znalezionych dziwadeł

### Walidacja manualna - `tests/manual/slice-10.md`

- [ ] Spaceruję przez wszystkie ekrany - nic nie crashuje
- [ ] Każdy widok ładuje się w mniej niż 1s na 4G
- [ ] Runbook czytam jako "świeża osoba" - czy jest jasny?

### Definition of Done MVP

- [ ] **Wszystkie testy slice 0-10 przechodzą**
- [ ] **Wszystkie walidacje manualne mają wypełniony raport**
- [ ] **65 produktów ze strony jest w D1, edytowalne z PWA**
- [ ] **Dodanie nowego produktu z telefonu < 3 minuty**
- [ ] **Lead z formularza pojawia się w PWA < 5 sekund**
- [ ] **Punkt kontrolny: 1 klik -> rebuild -> zmiana widoczna na warszawskiczas.pl**
- [ ] **Strona warszawskiczas.pl na CMS_MODE=live**
- [ ] **PWA zainstalowana na iPhone właściciela, działa standalone**
- [ ] **Cloudflare Access wpuszcza tylko 3 maile z allowlisty**

---

## Po MVP - Slice 11+ (kolejność do priorytetyzacji wtedy)

Po 1 tygodniu produkcyjnego użycia MVP, na podstawie realnego bólu:

### Slice 11 - Powiadomienia push i in-app (WAŻNE)

- [ ] Tabela `notifications` + `push_subscriptions`
- [ ] Web push z VAPID keys
- [ ] Service worker handler eventu `push`
- [ ] Endpoint subskrypcji push
- [ ] Cron Trigger w Workerze: codziennie o 9:00 push o follow-upach
- [ ] In-app: ekran `/powiadomienia` + licznik w nagłówku
- [ ] Triggery: nowy lead, follow-up dziś, zaległy follow-up, nieudana publikacja, scenariusz rolki do weryfikacji
- [ ] Onboarding dla iOS: ekran "Zainstaluj PWA na ekran główny żeby dostawać powiadomienia"
- [ ] Testy: integracyjne dla każdego trigera, walidacja manualna na iPhone i Android

### Pozostałe po MVP

- [ ] Audit log: tabela `audit_log` + middleware logujący każdy mutating call
- [ ] Role user/admin: kolumna `role`, gating endpointów, widok `Ustawienia -> Użytkownicy`
- [ ] Backup D1: Cron Trigger codziennie 03:00, `wrangler d1 export` -> R2, retencja 30 dni
- [ ] RODO formalne:
  - [ ] Polityka retencji leadów (auto hard-delete po 24 miesiącach od zamknięcia)
  - [ ] Endpoint eksportu danych klienta (Art. 15)
  - [ ] Endpoint hard delete na żądanie
  - [ ] Aktualizacja polityki prywatności na stronie (Cloudflare jako sub-procesor)
- [ ] PIN/biometria w PWA jako druga warstwa nad Access
- [ ] Moduł Treści: blog, GBP, drafty (osobny duży projekt)
- [ ] AI: drafty opisów produktów (Workers AI lub Anthropic API)
- [ ] Preview environment dla draftów produktów

---

## Filozofia testów (skrót z planu sekcja 23)

- Testy łapią regresje, nie podpierają zielonego CI
- Każdy plik testowy: `// Testuje X w sytuacji Y, bo Z`
- Każdy `it` ma opis sprawdzanego zachowania
- Preferujemy integration nad unit (chcemy wiedzieć że system działa)
- Nie testujemy trywialnych komponentów UI
- Vitest + `@cloudflare/vitest-pool-workers`, testowa D1 osobna
- Husky pre-commit: `vitest run --changed`
- CI: `vitest run` + `tsc --noEmit` + `wrangler deploy --dry-run`

## Filozofia walidacji manualnej (skrót z planu sekcja 24)

- Każdy slice ma `tests/manual/slice-N.md`: golden path, try to break it, performance, raport
- Walidacja na prawdziwym telefonie właściciela na produkcji
- Cykl: implementuj -> testuj automatycznie -> deploy -> waliduj manualnie -> naprawiaj -> zamknij slice
- Tylko zielony slice (testy + walidacja) przechodzi dalej
