# Wdrożenie na Hostinger — tryb serwerowy Next.js (WAŻNE)

> Ten dokument opisuje, dlaczego strona działa jako **aplikacja Next.js (server)**
> na Hostingerze, co kiedyś ją zepsuło i jakich rzeczy **nie wolno cofać**.
> Jeśli formularz przestanie wysyłać maile albo strona „umrze" z błędem
> `ChunkLoadError` — zacznij od tego pliku.

## Model hostingu (jak to faktycznie działa)

Strona jest dodana w hPanel jako **Node.js / Next.js app**, build leci
**automatycznie z gałęzi `main`** na GitHubie. Hostinger:

- buduje aplikację do `/home/{user}/domains/warszawskiczas.pl/nodejs/.next/`,
- uruchamia ją przez `next start` (Node 20),
- **sam generuje `.htaccess` w `public_html`**, który kieruje cały ruch do procesu Node.

Pliki klienta (`/_next/static/*`) i route'y serwerowe (`/api/*`) serwuje
**proces Node**, a nie Apache z katalogu statycznego.

Konfiguracja aplikacji Node w hPanel (musi tak zostać):

| Ustawienie | Wartość |
|---|---|
| Build command | `npm run build` |
| Start / Run command | `npm run start` (`next start`) |
| Output directory | `.next` (**NIE** `out`) |
| Node version | 20 |

## Co było zepsute (maj 2026) i dlaczego

Strona pierwotnie działała jako **eksport statyczny** (`output: 'export'` → `out/`,
serwowany przez Apache + ręcznie utrzymywany `public/.htaccess`). Mail szedł
przez skrypt PHP (`public/api/lead-mail-relay.php`).

Commit `53bd31e` przełączył kod na **tryb serwerowy** (żeby wysyłać mail przez
`/api/contact` + nodemailer + SMTP), ale zostały relikty trybu statycznego, które
łamały produkcję:

1. **`ChunkLoadError` / martwa strona.** `public/.htaccess` (reguła clean-URL
   `→ .html` + `ErrorDocument 404 /404.html`) przechwytywał żądania o
   `/_next/static/*` i `/api/*`. Te pliki w trybie serwerowym **nie leżą w
   katalogu Apache** (są w `nodejs/.next/`), więc Apache zwracał `404.html`
   (typ `text/html`) zamiast JS → przeglądarka: „MIME type is not executable" →
   `ChunkLoadError` → `Application error: a client-side exception`. Cała strona
   nie hydratowała się, więc **żaden przycisk/formularz nie działał** (stąd m.in.
   „nie działa kod ukrytej kolekcji").

2. **`NoFallbackError` w logach.** Route `app/(public)/[locale]/[[...path]]/page.tsx`
   miał `export const dynamicParams = false` (relikt eksportu). W trybie
   serwerowym catch-all z `dynamicParams=false` rzuca `NoFallbackError` przy
   każdym żądaniu/rewalidacji ścieżki spoza `generateStaticParams`.

3. **Mail nie wychodził.** Stary kanał PHP został usunięty, a nowy (`/api/contact`)
   nie mógł działać, bo serwer Node był niestabilny (pkt 1) i ruch do `/api/*`
   nie docierał do niego (pkt 1).

4. **„Stare hasło dalej działa".** Dopóki serwowane były stare artefakty
   statyczne, w buildzie zaszyte było stare `NEXT_PUBLIC_PRIVATE_COLLECTION_CODE`
   (`NEXT_PUBLIC_*` wmurowuje się przy `next build`, nie w runtime).

## Co naprawiło (i CO MUSI ZOSTAĆ)

- ❌ **Brak `output: 'export'`** w `next.config.js`. Tryb serwerowy jest jedynym
  wspieranym. Nie przywracać.
- ❌ **Brak `public/.htaccess`.** Hostinger generuje własny do routingu do Node.
  Przekierowania i nagłówki bezpieczeństwa robi `next.config.js`
  (`redirects()` + `headers()`). Nie dodawać własnego `.htaccess`.
- ✅ **`dynamicParams = true`** w `[locale]/[[...path]]/page.tsx` — nieznane URL-e
  dają czyste `notFound()` (404), bez `NoFallbackError`.
- ✅ **Mail przez `/api/contact`** (`runtime = 'nodejs'`, nodemailer + SMTP ze
  zmiennych środowiskowych Hostingera). Wymaga działającego serwera Node.
- ✅ **Formularz: dwa kanały RÓWNOLEGLE i niezależnie** (`from-cms/adapters/leads.ts`,
  `Promise.all`): MAIL (`/api/contact`) oraz APP/WhatsApp (`NEXT_PUBLIC_CMS_LEAD_URL`
  → CMS na Cloudflare). Awaria/timeout jednego nie blokuje drugiego. Sukces =
  zadziała przynajmniej jeden kanał.

## Zmienne środowiskowe — build vs runtime

- **`NEXT_PUBLIC_*`** (np. `NEXT_PUBLIC_PRIVATE_COLLECTION_CODE`,
  `NEXT_PUBLIC_CMS_LEAD_URL`) — wmurowują się **przy `next build`**. Zmiana
  wartości wymaga **przebudowy**. Muszą być dostępne w środowisku builda.
  W kodzie jest fallback `mokotowska71` na wypadek braku zmiennej przy buildzie.
- **`SMTP_*`, `CONTACT_*`** — czytane w **runtime** przez `/api/contact`.
  Zmiana wymaga restartu aplikacji Node (zwykle redeploy).

## CDN / cache — zasady

CDN i cache można trzymać włączone, ale:

- **Po KAŻDYM deployu wyczyść (purge) cache CDN.** Nowy build = nowy build-ID =
  nowe hashe plików `/_next/static/*`. Jeśli CDN poda **stary HTML** wskazujący
  na nieistniejące już chunki → wraca `ChunkLoadError`. To najczęstsza pułapka.
- **Nie cache'uj `/api/*`** (zwłaszcza `/api/contact`) — to dynamiczne route'y.
- `/_next/static/*` można cache'ować agresywnie (pliki są immutable, hash w nazwie).
- HTML stron — krótki TTL albo poleganie na nagłówkach z origin.

## Szybka diagnostyka maila

Logi aplikacji Node (`/api/contact` loguje przyczynę):

| Log | Przyczyna | Naprawa |
|---|---|---|
| `[contact] SMTP not configured` | brak `SMTP_*` w runtime | dodać/zsynchronizować zmienne, redeploy |
| `owner email failed … EAUTH` | złe `SMTP_PASS` | poprawić hasło skrzynki |
| `… ETIMEDOUT` / `ECONNREFUSED` | Hostinger blokuje port 465 | `SMTP_PORT=587` + `SMTP_SECURE=false` |
