# Warszawski Czas — Audyt architektury i plan rozwoju

> Data: 2026-05-17 · Autor analizy: Claude (Opus 4.7) · Stan repo: `main` @ `01aebb4`
>
> **UPDATE 2026-05-17 (aktualizacja założeń):** CMS będzie osobną aplikacją (duże integracje), strona to tylko "view". Sprzedaż stacjonarna — 2 min opóźnienia OK. Cel ruchu: **5 000 uu/mies** (~167/dzień). Patrz **Sekcja 10** poniżej — to ona zawiera ostateczną rekomendację. Sekcje 1-9 to oryginalny audyt; pozostawione dla kontekstu, ale rekomendacja z sekcji 3 (VPS) jest **nieaktualna** w świetle nowych założeń.

---

## 1. Co dzisiaj stoi pod maską (mapa stanu)

### 1.1 Stack
- **Next.js 15.5 (App Router)** + **React 19** + **TypeScript 5.7**
- **Tailwind 3.4** + **Framer Motion 12** + **Embla Carousel** + **Radix Slot** + **Lucide**
- **nodemailer 8** dla maila kontaktowego, **zod 4** dla walidacji
- Brak bazy danych, brak ORM, brak CMS, brak panelu admina, brak autoryzacji użytkowników (poza prymitywnym `private-access` API)

### 1.2 Struktura treści
- **33 zegarki** trzymane jako **statyczna tablica TypeScript** w [data/mock-products.ts](data/mock-products.ts) (1188 linii, 65 obiektów `id` — część wpisów ma duplikaty / warianty)
- **Zdjęcia produktów** w `/public/products/<slug>/{front,left,right,back}.jpg` + surowe materiały i manifesty w `/zegarki/` (poza buildem)
- **~28 statycznych landing pages SEO** w `app/(public)/` (np. `zegarki-rolex-warszawa`, `skup-zegarkow-centrum-warszawy`, `chronografy-warszawa`, `zegarki-z-diamentami-warszawa`)
- **i18n PL/EN/UA** przez middleware + dynamiczny route `[locale]/[[...path]]` + słownik w [lib/localized-landings.ts](lib/localized-landings.ts) (611 linii)

### 1.3 SEO — to jest największa siła obecnej strony
- `sitemap.ts`, `robots.ts`, JSON-LD `LocalBusiness/JewelryStore/Store` z geo, godzinami, telefonem
- `hreflang` w nagłówkach HTTP (PL/EN/UA + `x-default`) generowane w [middleware.ts](middleware.ts)
- Per-page metadata (canonical, OG, Twitter), `next/font` z `display: swap`, `next/image`
- 8 redirectów 301 ze starych URL-i ([next.config.js:42-53](next.config.js#L42-L53))
- Bardzo gęsta sieć słów kluczowych long-tail (marka × Warszawa × kategoria × dzielnica)

### 1.4 UX i animacje
- Hero z wideo (`rolex.mp4`), Ken Burns, scroll progress, page transitions, magnetic button, wax seal, reveal text, fade-in — wszystko w [components/ui/](components/ui/)
- Loading screen, mobile menu, WhatsApp button, language switcher
- Formularz kontaktowy z honeypotem (`company`), `min-fill-time`, rate-limit per IP

### 1.5 Backend "as is"
- 2 Route Handlery: [app/api/contact/route.ts](app/api/contact/route.ts) (mail + WhatsApp + auto-reply) i `app/api/private-access/route.ts`
- Rate limit **w pamięci procesu** (`lib/contact/rate-limit.ts`) — resetuje się przy każdym restarcie, nie działa w środowisku multi-instance
- Brak persystencji leadów (lecą tylko mailem)
- Brak analityki własnej, brak A/B, brak feature flag

---

## 2. Czy realizuje twoje 4 priorytety?

| Priorytet | Stan | Komentarz |
|---|---|---|
| **1. Pozycjonowanie** | **9/10** | Najlepsza część projektu. App Router SSG, sitemap, JSON-LD, hreflang, 28 landing pages, redirecty. Jedyne czego brakuje: dynamiczny `BreadcrumbList`, JSON-LD per-produkt (`Product` + `Offer`), strony marek jako pełnoprawne huby, blog/content. |
| **2. UX, prędkość, animacje** | **7/10** | Framer Motion + Next 15 + statyczne strony = solidne LCP. Ale: `/public/rolex.mp4` w hero, brak preconnect do Google Maps, dużo komponentów `'use client'` (cała sekcja animacji), brak realnych metryk Web Vitals. |
| **3. Łatwość dodawania oferty** | **2/10** | **Kluczowa słabość.** Dodanie zegarka = edycja [data/mock-products.ts](data/mock-products.ts), wrzucenie 3-4 plików JPG do `/public/products/<slug>/`, commit + redeploy. Nie ma admina, nie ma uploadera, nie ma walidacji w runtime, nie ma historii zmian poza git. Status `Dostępny/Zarezerwowany/Niedostępny` = manualna edycja w kodzie. |
| **4. Rozbudowa, integracje, CRM/lead-mgmt** | **2/10** | Strona jest "monolitem prezentacyjnym". Brak DB = brak miejsca na leady, CRM, ticketing serwisu, analytics, integracje (FB Lead Ads, Instagram DM, kalendarz wizyt). Mail z formularza wylatuje w eter — nie ma listy "kto się odezwał i kiedy". |

**Werdykt:** strona jest świetna jako **brochure SEO**, ale jest **wąskim gardłem** dla wszystkiego co planujesz dalej (pkt 3 i 4).

---

## 3. Hosting: trzy realne ścieżki + koszty

> Założenia: ~5k unikalnych użytkowników/miesiąc na start, do 50k przy aktywnym SEO/Ads w ciągu roku, ~100 produktów docelowo.

### Ścieżka A — Hostinger Business (już opłacony), Next.js jako **static export**
**Koszt:** **0 zł extra/mies** (masz opłacone). Hostinger Business ~13-20 zł/mies.

- **Co działa:** statyczne strony (SSG), wszystkie landingi SEO, galeria, animacje, sitemap, robots, JSON-LD
- **Co przestaje działać:** `next/image` optymalizacja w locie, Route Handlery (`/api/contact`, `/api/private-access`), middleware (hreflang w nagłówkach trzeba przenieść do `<link>` w HTML), rewrites/redirects (trzeba w `.htaccess`)
- **Workaround dla formularza:** zewnętrzny endpoint — **Formspree** (darmowy do 50/mies, 10$/mies płatny), **Web3Forms** (darmowy 250/mies), **EmailJS** (200/mies darmowo), lub Cloudflare Worker (darmowy 100k req/dzień)
- **Workaround dla obrazów:** pre-build `sharp` w `next.config.js` + `<picture>` z WebP/AVIF generowanym w CI
- **Panel admina:** **niemożliwy bez backendu** — alternatywa: **Sanity / Decap CMS / TinaCMS** (darmowe tiery), commitują JSON do GitHub, Vercel/GitHub Action robi rebuild
- **Werdykt:** Realne tylko jeśli zaakceptujesz CMS-based workflow (edytujesz w przeglądarce → commit → rebuild ~2 min → live). Dla 33-100 produktów to OK. Dla CRM/leadów — **nie wystarczy**, trzeba dorzucić zewnętrzny backend (np. Supabase free tier).

### Ścieżka B — Hostinger **VPS KVM 1/2** (od nich, niski koszt)
**Koszt:** **~25-40 zł/mies** (KVM 1: 1 vCPU, 4GB RAM, 50GB NVMe — wystarczy na long czas; przy promo nawet 17 zł/mies przy 2-letnim okresie)

- **Co dostajesz:** pełen Linux, Node.js, PM2/Docker, Nginx, PostgreSQL/SQLite, Redis lokalnie
- Możesz uruchomić **dokładnie ten Next.js w SSR**, plus własną bazę, plus panel admina, plus webhooks, plus cron joby (cron ofert na social, scraper rynku, itp.)
- Wymaga **devops** (TLS przez Caddy/Certbot, backupy, monitoring, deploy pipeline) — albo użyć **Coolify / Dokploy** (self-hosted "Vercel-like", darmowe, prosty UI)
- **Werdykt:** **Najlepszy stosunek ceny do możliwości**, ale wymaga ~1 dnia konfiguracji i comiesięcznego zerknięcia. Skaluje się do twoich planów (admin, CRM, integracje).

### Ścieżka C — Vercel + Neon/Supabase (managed, najlepszy DX)
**Koszt:** **0 zł na start**, rosnąco:
- Vercel Hobby: darmowy (ale formalnie nie do komercji — produkcyjnie potrzebny **Pro: 20 USD/mies/użytkownika**)
- Neon free: 0.5GB, 1 projekt — wystarczy długo; Pro: 19 USD/mies
- Supabase free: 500MB DB + 1GB storage + auth — często wystarcza w pełni
- **Realistyczny rachunek:** 0 zł przez pierwsze ~6 mies, potem **~80-100 zł/mies** (Vercel Pro) jeśli ruch rośnie

- **Co dostajesz:** zero devops, atomic deploy z PR-ów, edge runtime, Image Optimization, Analytics, Speed Insights, preview environments, prosty webhook → revalidate
- **Co tracisz:** opłacony Hostinger Business (chyba że zostawisz tam tylko maila/domenę)
- **Werdykt:** **Najlepszy UX dla dewelopera**, najszybszy ship, ale dla butiku z ~100 produktami to bywa nadmiarowe. ToS Vercel Hobby zakazuje komercyjnego użycia — produkcyjnie trzeba Pro.

### Moja rekomendacja
**Ścieżka B (Hostinger VPS KVM 1)** — koszt podobny do tego co już płacisz, a otwiera wszystko czego potrzebujesz w pkt 3 i 4. Hostinger Business możesz zostawić dla maila domenowego (`biuro@warszawskiczas.pl`), albo przekierować domenę całkiem na VPS i hosting wygasić po końcu okresu.

> Jeśli absolutnie nie chcesz dotykać devops — **Ścieżka A + Supabase free** jako backend dla leadów/admin, zostajesz na Hostingerze, ale akceptujesz że rebuild po edycji produktu = ~2 min latency.

---

## 4. Czy robić przebudowę od zera?

**Nie. Przebudowa od zera to marnotrawstwo.** Obecna baza Next.js 15 jest dobra — to czego brakuje to **warstwa danych** i **panel admina**. Cały kod prezentacyjny, SEO, animacje, landingi — **zostają**. Wymieniamy jedynie **źródło prawdy** dla produktów (z `mock-products.ts` na DB) i **dodajemy** panel.

### Co konkretnie się zmienia (i co nie)

| Obszar | Teraz | Po migracji | Zostaje? |
|---|---|---|---|
| Komponenty UI (`components/ui/`, `sections/`) | TSX + Framer Motion | bez zmian | ✅ |
| Landingi SEO (`app/(public)/zegarki-*`) | SSG z hardkodu | SSG, ale lista produktów z DB przez `generateStaticParams` | ✅ (lekko podkręcone) |
| i18n (middleware + `localized-landings`) | Statyczne | bez zmian | ✅ |
| `data/mock-products.ts` | 1188 linii TS | **usunięte** | ❌ → DB |
| Karty produktu (`/produkty/[slug]`) | Z mocka, SSG | Z DB, ISR (revalidate co X min) lub on-demand | 🔄 |
| Formularz kontaktu | Nodemailer + in-memory rate-limit | + zapis do DB (tabela `leads`), rate-limit w Redis/Postgres | 🔄 |
| Panel admina | **brak** | **nowy** — `/admin` chroniony hasłem (NextAuth/Lucia) | ➕ |
| Upload zdjęć | ręcznie do `/public/products/` | **UploadThing / Cloudflare R2 / S3** + sharp resize w API | ➕ |
| CRM / leady | brak | tabela `leads` + widok w adminie + webhook do Slack/Discord | ➕ |
| Integracje (FB, IG, Mailerlite) | brak | webhooks + queue (BullMQ na Redis) | ➕ |

### Stack rekomendowany (warstwa nowa)
- **DB:** PostgreSQL (Supabase / Neon / lokalny na VPS) — schema-first
- **ORM:** **Drizzle** (lekki, type-safe, działa wszędzie) — lepszy niż Prisma na VPS-ach (brak `prisma generate` na każdym deploy)
- **Auth admina:** **Lucia** lub **NextAuth (Auth.js v5)** z provider credentials + 2FA TOTP
- **Upload obrazów:** **Cloudflare R2** (10 GB free, zero-egress) + `sharp` w Route Handler
- **Walidacja:** zostaje **zod** (jest)
- **Mail:** **Resend** (3000 maili/mies free, świetny DX) zamiast SMTP nodemailer — albo zostawić nodemailer jeśli mail Hostingera ma być źródłem
- **Analityka:** **Plausible self-hosted** (na VPS) lub **Umami** — GDPR friendly, bez cookie banner
- **Optymalizacja obrazów:** zostaje `next/image` (SSR) lub `sharp` pre-build (static)

---

## 5. Plan przebudowy w 4 fazach (każda działająca samodzielnie)

### Faza 0 — Hardening obecnego stanu (1-2 dni, robić TERAZ)
Bez względu na dalszą decyzję — niska inwestycja, duży zwrot:
- [ ] Dodać `BreadcrumbList` JSON-LD do każdej karty produktu i landinga
- [ ] Dodać `Product` + `Offer` JSON-LD na `/produkty/[slug]`
- [ ] Usunąć duplikaty z `mock-products.ts` (65 wpisów dla 33 zegarków)
- [ ] Dodać preconnect do Google Maps i lazy-load mapy (intersection observer)
- [ ] Real User Monitoring — Vercel Analytics lub Plausible
- [ ] Skompresować `rolex.mp4` do AV1/WebM i dodać poster image
- [ ] Audit Lighthouse na 3 stronach + zapisać baseline

### Faza 1 — DB + admin (1-2 tygodnie)
- [ ] Wybór hostingu (decyzja z sekcji 3)
- [ ] Setup PostgreSQL + Drizzle
- [ ] Migracja `mock-products.ts` → tabela `products` (skrypt jednorazowy)
- [ ] Tabele: `products`, `product_images`, `leads`, `admin_users`, `audit_log`
- [ ] `/admin/login` + middleware ochrony
- [ ] `/admin/products` — lista, edycja, status, drag-to-reorder
- [ ] `/admin/products/new` — formularz + upload zdjęć (R2 lub lokalny `/uploads`)
- [ ] Karty produktu i listingi czytają z DB (ISR `revalidate: 60`)
- [ ] **Strona publiczna wygląda identycznie** — to powinien być cel akceptacji fazy 1

### Faza 2 — Leady i CRM (1 tydzień)
- [ ] Formularz kontaktu zapisuje do `leads` + wysyła mail (jak teraz)
- [ ] `/admin/leads` — lista, status (nowy / w toku / zamknięty / spam), notatki
- [ ] Webhook do WhatsApp Business / Slack / Discord przy nowym leadzie
- [ ] Tagowanie źródła (UTM, landing, produkt)
- [ ] Eksport CSV

### Faza 3 — Marketing / content / integracje (2-4 tyg, modułowo)
- [ ] Blog (markdown w DB lub MDX z `/content`) → świetne dla SEO long-tail
- [ ] Generator postów społecznościowych z karty produktu (template + brand kit)
- [ ] Integracja z Mailerlite / Brevo (newsletter "nowe zegarki w butiku")
- [ ] Kalendarz wizyt (Cal.com self-hosted lub iframe)
- [ ] FB/IG Lead Ads webhook → tabela leadów
- [ ] Mini-katalog "sold archive" — pozytywny SEO signal i social proof

---

## 6. Bilans plus / minus przebudowy

### ✅ Plusy
- **Admin = setki godzin oszczędności rocznie.** Dodanie zegarka z 15 min (edycja TS + commit + push + czekanie na build) do 60 sekund (drag-drop zdjęć, formularz, "Publikuj").
- **Status `Dostępny / Sprzedany` w 1 kliknięciu** — dziś wymaga deploya, jutro będzie real-time przez ISR.
- **Leady przestają znikać.** Historia kontaktu, śledzenie konwersji, atrybucja źródeł.
- **Skalowanie SEO**: generowanie landingów per marka × kategoria z DB zamiast ręcznego pisania TS.
- **Integracje** stają się trywialne — webhook, cron, queue, wszystko gotowe.
- **Wielodostępność**: edek z butiku może wrzucać zegarki bez znajomości git/IDE.

### ❌ Minusy
- **Koszt utrzymania DB**: 0-20 zł/mies (tier free) lub 0 zł (SQLite na VPS), ale realnie **uwaga developerska** rośnie — backupy, migracje, security patche
- **Powierzchnia ataku rośnie**: admin panel = potencjalny wektor; trzeba 2FA, rate-limit logowania, audit log
- **Złożoność deploy**: zamiast `git push` → Vercel, masz migracje DB w pipeline (`drizzle-kit migrate`), trzeba uważać przy zmianach schematu
- **Czas robót**: faza 1+2 to ~3 tygodnie pracy developera (lub 2 mies. wieczorami)
- **ISR/SSR vs SSG** — odrobinę wolniejszy TTFB niż czysto statyczne strony (ale i tak <100ms z dobrym hostem)

---

## 7. Krytyczne pytania zanim ruszysz

- **Kto będzie używał admina?** Tylko ty? Edek z butiku? — wpływa na wybór auth (passkey vs hasło + 2FA)
- **Czy chcesz, żeby ceny były publiczne** dla części zegarków? — dziś wszystko `priceOnRequest: true`, można to mieszać
- **Język admina** — PL only czy też EN dla zagranicznych pośredników?
- **Czy planujesz e-commerce** (kup online z płatnością Stripe/Przelewy24) czy tylko "zapytaj o ofertę"? — radykalna różnica w architekturze
- **Co z RODO/leadami z UE?** — jeśli zapisujesz, potrzebujesz polityki retencji i mechanizmu "zapomnij mnie"

---

## 8. Checklista decyzyjna (zaznacz przed startem fazy 1)

- [ ] Wybór hostingu: ☐ A (Hostinger static) / ☐ B (Hostinger VPS KVM) / ☐ C (Vercel + Neon)
- [ ] Wybór DB: ☐ PostgreSQL managed (Supabase/Neon) / ☐ PostgreSQL na VPS / ☐ SQLite na VPS
- [ ] Wybór storage zdjęć: ☐ Cloudflare R2 / ☐ lokalny `/uploads` na VPS / ☐ Supabase Storage / ☐ UploadThing
- [ ] Wybór mailera: ☐ Resend / ☐ zostaje nodemailer + SMTP Hostingera
- [ ] Auth admina: ☐ NextAuth credentials + TOTP / ☐ Lucia + passkey / ☐ Supabase Auth
- [ ] Analytics: ☐ Plausible self-hosted / ☐ Umami / ☐ Vercel Analytics / ☐ GA4 (NIE — RODO ryzyko)
- [ ] Strategia migracji obrazów: ☐ pozostają w `/public` / ☐ migracja do R2/S3 z URL-ami w DB
- [ ] Czy faza 0 (hardening) wykonana przed fazą 1?
- [ ] Backup strategy: ☐ daily DB dump na R2 / ☐ snapshot VPS / ☐ ręczny eksport CSV

---

## 9. TL;DR

**Obecna strona:** świetne SEO, dobre UX, **fatalne** zarządzanie ofertą i zero infrastruktury pod CRM.

**Nie przebudowuj od zera.** Zachowaj 95% kodu, dołóż **PostgreSQL + Drizzle + panel admina + tabelę leadów**. Faza 1+2 = ~3 tyg pracy.

**Hosting:** **Hostinger VPS KVM 1 (~25-40 zł/mies)** to złoty środek — taniej niż Vercel Pro, daje pełną elastyczność, działa z Hostingerem którego już masz. Alternatywa low-effort: zostań na Hostinger Business + Supabase free dla danych.

**Najwyższy ROI dziś:** Faza 0 (hardening SEO i Web Vitals) — 1-2 dni, zero ryzyka, mierzalny zysk.

---

## 10. Re-analiza przy nowych założeniach (2026-05-17)

### 10.1 Co się zmienia w myśleniu o stronie

Nowe założenia **radykalnie upraszczają** problem:

| Stare założenie z sekcji 1-9 | Nowe założenie | Konsekwencja |
|---|---|---|
| Admin panel musi być częścią strony | **CMS to osobna aplikacja** (twój własny "operating system" biznesu) | Strona przestaje być "system" — staje się **prezentacją** (read-only view) danych z CMS |
| Latency aktualizacji ma znaczenie | **2 minuty OK**, sprzedaż jest stacjonarna | **Można zostać przy SSG** + rebuild on webhook → zerowy run-time backend dla katalogu |
| Skala "do 50k uu/mies" | **5k uu/mies cel** (~167/dzień, ~7/godz, ~1 co 8 min) | Każdy hosting, nawet darmowy tier, jest 100× za duży. Wydajność to **nie-problem**. |
| Strona musi mieć leady, CRM, integracje | Wszystko to **żyje w CMS** | Strona musi tylko **POST-ować lead do webhooka CMS** — koniec |

**Strona przestaje być wąskim gardłem w pkt 3 i 4** — bo te punkty przenoszą się do osobnej aplikacji CMS. Strona zostaje przy pkt 1 (SEO) i pkt 2 (UX), gdzie i tak była mocna.

### 10.2 Nowe zalety, które się otwierają

- **Strona może być w 100% statyczna** (`next build && next export` lub po prostu Next 15 z `output: 'export'`) → najszybszy możliwy hosting, w tym **Hostinger Business który już masz**, lub nawet **Cloudflare Pages / Netlify / GitHub Pages** za darmo
- **Brak DB w stronie** = brak migracji, brak backupów, brak attack surface po stronie www, brak 2FA do pilnowania
- **CMS i strona są niezależne** = można wymienić jedno bez ruszania drugiego. Możesz nawet **zmienić framework strony** za rok bez dotykania danych w CMS.
- **Cache i CDN są trywialne** — czysto statyczne pliki, Cloudflare przed Hostingerem = LCP <500ms globalnie za darmo
- **Deploy strony staje się "głupi"**: `git push` lub webhook z CMS → CI buduje → wrzuca pliki na hosting przez SFTP/rsync/Pages

### 10.3 Nowe wady / ryzyka, które warto znać

- **Headless coupling**: kontrakt API między CMS a stroną staje się **krytycznym interfejsem**. Zmieniasz pole w CMS → strona musi się buildować z nowym schematem → potrzebujesz wersjonowania API i contract testów. To nie jest hard, ale wymaga dyscypliny.
- **Build time rośnie liniowo z liczbą produktów**: dziś 33 zegarki = build ~1 min. Przy 500 produktach + wielu landingach = 5-10 min. Nie blokujące do ~1000 produktów, potem trzeba ISR.
- **Preview / draft content**: jeśli chcesz w CMS zobaczyć "jak będzie wyglądał produkt zanim go opublikuję", musisz dodać **preview mode** (Next.js to wspiera, ale wymaga endpointu który nie istnieje w eksporcie statycznym → trzeba mini-serwer lub osobny preview deploy)
- **Webhook timing**: jeśli CMS wyśle webhook gdy CI jest zajęte, możesz dostać "missed update" — trzeba debouncer/queue (15 linii kodu, nie problem)
- **Static export ogranicza Next.js**: znika `next/image` runtime optymalizacja, znikają Route Handlers, middleware (`hreflang` w nagłówkach HTTP trzeba przerzucić do `<link rel="alternate">` w `<head>`)
- **Formularz kontaktu** nie może już iść do `/api/contact` na tej samej domenie → musi POST-ować do CMS (CORS, ale to tylko nagłówek)

### 10.4 Co konkretnie zostaje do zrobienia na stronie (minimalne)

Faza minimum przy nowej architekturze (1-3 dni pracy, nic więcej):

1. **Wynieść `mock-products.ts` do JSON** (`data/products.json`) — zerowa zmiana funkcjonalna, ale przygotowuje grunt pod fetch z CMS
2. **Wprowadzić warstwę abstrakcji**: `lib/products.ts` z funkcją `getAllProducts()` która dziś czyta JSON, jutro fetch-uje z CMS w build-time
3. **Przełączyć formularz kontaktu** na wysyłkę do `process.env.CMS_LEAD_WEBHOOK_URL` (z fallback do obecnego `/api/contact`)
4. **Włączyć `output: 'export'`** w `next.config.js` gdy CMS będzie gotowy (do tego czasu zostaje SSR — działa)
5. **Hreflang z middleware → `<link>` w `<head>`** (Next 15 metadata API to robi natywnie)
6. **Faza 0 hardening** (sekcja 5) — zrobić niezależnie, daje SEO punkty od razu

**To wszystko.** Żadnego DB na stronie, żadnego admina na stronie, żadnej migracji do VPS. Hostinger Business + statyczny build = wystarczy.

### 10.5 Wielka tabela: co blokuje co i kiedy

> **Legenda:** 🟢 nieblokujące · 🟡 do obejścia / wymaga uwagi · 🔴 blokujące przy danej decyzji

| # | Aspekt | Wariant A: zostaje jak jest (mock TS, SSR na VPS) | Wariant B: statyczna strona + osobny CMS (rekomendowany) | Wariant C: monolit z DB + admin w stronie | Kiedy zaczyna blokować |
|---|---|---|---|---|---|
| 1 | **Dodanie zegarka** | 🔴 edycja TS + git + deploy (15 min, wymaga dewelopera) | 🟢 klik w CMS → webhook → rebuild 1-2 min | 🟢 klik w adminie → ISR 60s | Już dziś, przy każdym dodanym zegarku |
| 2 | **Zmiana statusu Dostępny→Sprzedany** | 🔴 jak wyżej, deploy dla 1 pola | 🟢 toggle w CMS, live za ~2 min | 🟢 toggle, live za 60s | Już dziś |
| 3 | **Ruch 5k uu/mies (~7/h)** | 🟢 trywialne | 🟢 trywialne (CDN/static) | 🟢 trywialne | Nigdy przy tej skali |
| 4 | **Ruch 50k uu/mies** | 🟡 wymaga uwagi (VPS 1 vCPU może mulić peak) | 🟢 trywialne (CDN) | 🟡 trzeba ISR + cache | Przy planowanej skali nie dotyczy |
| 5 | **Ruch 500k uu/mies** | 🔴 trzeba skalować VPS | 🟢 nadal trywialne | 🟡 trzeba cache + read replica | Nie dotyczy w horyzoncie 3 lat |
| 6 | **Hostowanie na Hostinger Business** | 🔴 niemożliwe (brak Node.js w trybie SSR) | 🟢 idealne — static export, FTP/Git deploy | 🔴 niemożliwe | Już dziś, jeśli wymóg twardy |
| 7 | **Koszt hostingu** | 🟡 ~25-40 zł/mies (VPS) + utrzymanie | 🟢 0 zł extra (masz Business opłacony) | 🟡 25-40 zł/mies (VPS) lub 80 zł (Vercel Pro) | Stały koszt, nie blokuje ale rośnie |
| 8 | **Panel admina dla edka z butiku** | 🔴 nie istnieje | 🟢 w CMS, niezależnie od strony | 🟢 `/admin` w stronie | Gdy ktoś inny niż ty ma edytować ofertę |
| 9 | **Zbieranie leadów (historia, status, notatki)** | 🔴 nie istnieje, leady lecą tylko mailem | 🟢 webhook do CMS → tabela leadów w CMS | 🟢 tabela `leads` w stronie | Gdy zaczniesz aktywny outreach / follow-up |
| 10 | **Integracje (FB Lead Ads, IG DM, Mailerlite, kalendarz)** | 🔴 brak miejsca w architekturze | 🟢 wszystko w CMS, strona nic nie wie | 🟡 osobne webhooks, ale w monolicie strony | Gdy ruszysz performance marketing |
| 11 | **SEO long-tail (28 landingów dziś)** | 🟢 działa świetnie | 🟢 działa świetnie (te same SSG) | 🟢 działa | Nie blokuje |
| 12 | **Dodanie nowego landinga marka×kategoria** | 🟡 ręczna edycja TS (10 min) | 🟢 wpis w CMS → auto-generuje przy buildzie | 🟢 wpis w DB → ISR | Gdy zaczniesz skalować SEO ofensywnie |
| 13 | **Blog / content marketing** | 🔴 trzeba dorobić MDX strukturę | 🟢 w CMS (Sanity/Strapi/Payload są do tego stworzone) | 🟡 dorabiasz w stronie | Gdy ruszysz content marketing |
| 14 | **Multilang (PL/EN/UA)** | 🟢 działa | 🟡 CMS musi obsługiwać i18n (większość headless to wspiera) | 🟢 jak teraz | Nie blokuje, ale wymaga wyboru CMS pod kątem i18n |
| 15 | **Preview "zobacz zegarek przed publikacją"** | 🔴 nie ma | 🟡 trzeba osobny preview deploy lub on-demand revalidate | 🟢 natywnie w adminie | Gdy zechcesz workflow draft→review→publish |
| 16 | **Upload zdjęć (drag&drop, resize, WebP/AVIF)** | 🔴 ręcznie do `/public` | 🟢 w CMS (większość ma wbudowane + CDN obrazów) | 🟡 trzeba zbudować w stronie | Już dziś, przy 1. dodanym zegarku |
| 17 | **Backup / disaster recovery** | 🟡 cały stan w git (OK) | 🟢 git + backup CMS (większość zarządza) | 🔴 trzeba własny backup DB | Gdy CMS lub DB padnie |
| 18 | **Bezpieczeństwo (admin = wektor ataku)** | 🟢 brak panelu = brak wektora w stronie | 🟢 strona nadal bez panelu, CMS osobno (mniejszy attack surface na publicznym URL strony) | 🔴 panel admina na tej samej domenie co strona = duży wektor | Krytyczne gdy panel istnieje |
| 19 | **Czas wdrożenia całości** | 🟢 0 dni (nic nie robisz) | 🟡 3-5 dni strony + tygodnie na CMS (równolegle) | 🔴 3-4 tygodnie pełnej przebudowy | Gdy chcesz szybko ruszyć z resztą biznesu |
| 20 | **Zmiana technologii strony za 2 lata** | 🟡 trzeba migrować dane z TS | 🟢 strona "wymienna" — dane są w CMS, strona to tylko widok | 🔴 monolit, sztywno związany | Jeśli kiedyś zechcesz Astro/Remix/cokolwiek |
| 21 | **Wymiana CMS za 2 lata** | n/a (brak CMS) | 🟡 nowy CMS musi spełnić ten sam kontrakt API | n/a (admin to część strony) | Hipotetyczne |
| 22 | **Kontrakt API CMS↔strona** | n/a | 🟡 wymaga dyscypliny — wersjonowanie, contract tests | 🟢 nie istnieje (wszystko w jednej apce) | Stale, od dnia 1 |
| 23 | **Preview environments (PR-y)** | 🔴 brak | 🟢 static = trywialne (Cloudflare Pages, Netlify deploy previews) | 🟡 wymaga osobnej DB per env | Gdy więcej niż 1 osoba edytuje stronę |
| 24 | **GDPR / "zapomnij mnie" dla leadów** | 🟢 brak leadów = brak danych | 🟢 leady są w CMS, GDPR tam | 🔴 trzeba zbudować w stronie | Gdy zaczniesz zbierać leady systematycznie |
| 25 | **Web Vitals (LCP/INP/CLS)** | 🟡 SSR z VPS = TTFB 100-300ms | 🟢 static + CDN = TTFB <50ms globalnie | 🟡 jak A, plus dochodzi pamięć od admina | Dla Google rankingu — stale |
| 26 | **Koszt poznawczy dewelopera (ile trzymać w głowie)** | 🟢 niski, jeden monolit | 🟢 niski **per aplikacja**, ale 2 aplikacje | 🔴 wysoki, jedno API + DB + UI + admin razem | Stale |
| 27 | **Lock-in vs swoboda** | 🟢 zero lock-in (czysty Next) | 🟢 zero lock-in jeśli CMS open-source (Payload/Strapi/Directus); 🟡 jeśli SaaS (Sanity) | 🟢 zero lock-in | Stale |
| 28 | **E-commerce (płatności online)** | 🔴 trzeba dobudować Stripe/P24 + koszyk + checkout | 🟡 strona statyczna + JS checkout (Snipcart, Shopify Buy Button) | 🟡 dobudowujesz w stronie | Jeśli kiedyś sprzedaż online — nie deklarowane |
| 29 | **Newsletter / mailing** | 🔴 brak | 🟢 z CMS, lista subskrybentów tam | 🟡 dobudowujesz | Gdy ruszysz email marketing |
| 30 | **Audit log "kto co zmienił w ofercie"** | 🟢 git history | 🟢 CMS z reguły wbudowane | 🟡 trzeba zbudować | Gdy więcej niż 1 osoba edytuje |

### 10.6 Werdykt zaktualizowany

**TAK, warto zmienić — ale BARDZO MAŁO i tylko strategicznie.**

Konkretnie:

1. **Zostaw stronę jak jest pod względem UI/UX/SEO** (jest dobra). Faza 0 (hardening) wciąż ma sens — to 1-2 dni.
2. **Wprowadź warstwę abstrakcji** (`lib/products.ts`) zamiast bezpośrednich importów z `mock-products.ts`. Dziś czyta JSON, jutro fetch z CMS. 0.5 dnia roboty.
3. **Formularz kontaktu** wskaż na env-var z URL-em webhooka CMS. Dziś fallback do `/api/contact`. 0.5 dnia roboty.
4. **Nie przebudowuj** strony pod kątem admina/DB/leadów — to wszystko jest **w CMS, nie w stronie**.
5. **Hosting:** **zostań na Hostinger Business**. Gdy CMS będzie gotowy → przełącz Next na `output: 'export'` i deploy przez FTP/Git Action. Oszczędzasz koszt VPS i utrzymania.
6. **Nie rób Wariantu C** (monolit z adminem) — to dziś byłoby uzasadnione, ale skoro robisz osobny CMS, dublujesz pracę.

**Co byłoby blokujące przy "nic nie zmieniam":** punkty 1, 2, 6, 8, 9, 10, 13, 16, 17 z tabeli — wszystkie czerwone w wariancie A. Większość rozwiązuje się **przez CMS, nie przez zmiany w stronie**.

**Realny harmonogram:**
- **Teraz (tydzień):** Faza 0 hardening + warstwa abstrakcji nad mockiem + przygotowanie webhook URL dla formularza (~3-5 dni)
- **Równolegle (tygodnie-miesiące):** budowa CMS jako osobnej aplikacji
- **Gdy CMS gotowy (1 dzień):** przełącznik `output: 'export'`, podłączenie fetch z CMS, deploy na Hostinger Business, wygaszenie `/api/contact`

**Wybór CMS to osobna decyzja** (Payload CMS / Directus / Strapi / Sanity / własny Next.js app z Drizzle) — wymaga osobnego dokumentu, bo zależy od tego ile integracji robisz, czy chcesz self-host, jaki masz budżet i czy potrzebujesz custom logiki biznesowej.

