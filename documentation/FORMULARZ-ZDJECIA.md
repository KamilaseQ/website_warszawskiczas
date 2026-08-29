# Zdjęcia w formularzu — co jest na stronie, co dorobić w aplikacji

> Stan: 2026-08-29. Dotyczy repo `website_warszawskiczas` (strona) i `app_warszawskiczas` (CMS/CRM).

Klient może opcjonalnie dołączyć do zgłoszenia kilka zdjęć. Zdjęcia lecą tym
samym żądaniem co reszta leada, do obu kanałów naraz — maila i aplikacji.

---

## 1. Jak formularz jest połączony z resztą systemu (stan wyjściowy)

`from-cms/adapters/leads.ts` → `submitLead()` wysyła **ten sam JSON do dwóch
niezależnych kanałów, równolegle**:

| Kanał | Endpoint | Co robi | Kto to utrzymuje |
|---|---|---|---|
| MAIL | `POST /api/contact` (Route Handler tej strony) | nodemailer + SMTP: powiadomienie do butiku + autoodpowiedź do klienta | to repo (`lib/contact/*`) |
| APP | `POST https://api.camalio.pl/api/v1/leads` (`NEXT_PUBLIC_CMS_LEAD_URL`) | zapis leada w D1 + powiadomienie WhatsApp (CallMeBot) | repo `app_warszawskiczas` |

Reguła sukcesu jest niezmieniona: **zadziała choć jeden kanał → użytkownik widzi
podziękowanie**; żaden → komunikat „zadzwoń". Awaria SMTP nie blokuje zapisu
leada w CRM i odwrotnie.

Formularze korzystające z tego adaptera:

- `ContactForm` → `/kontakt` (`type: 'contact'`),
- `InquiryForm` → `/uslugi/skup`, `/uslugi/komis`, `/uslugi/naprawa-i-serwis` (`type: 'inquiry'`),
- `ContactLink` (nagłówek, stopka, CTA na landingach) tylko **prowadzi** do `/kontakt` i zapisuje `source`/`product` w `sessionStorage` — sam nic nie wysyła.

Kontrakt obu kanałów to jeden plik: `from-cms/schemas/lead.ts`
(`LeadPayloadSchema`), zduplikowany po stronie aplikacji jako
`src/contracts/lead.ts`. **Te dwa pliki muszą pozostać zgodne.**

---

## 2. Co zostało zrobione na stronie

### 2.1 Kontrakt — `from-cms/schemas/lead.ts`

Nowe, **opcjonalne** pole `attachments`:

```ts
attachments?: Array<{
  name: string          // ≤ 120 znaków, tylko do wyświetlenia
  type: 'image/webp' | 'image/jpeg' | 'image/png'
  data: string          // czysty base64, BEZ prefiksu `data:...;base64,`
}>
```

Limity (eksportowane jako stałe, używaj ich zamiast liczb):

| Stała | Wartość | Znaczenie |
|---|---|---|
| `MAX_LEAD_ATTACHMENTS` | 5 | liczba zdjęć na zgłoszenie |
| `MAX_LEAD_ATTACHMENT_BYTES` | 1 500 000 | jedno zdjęcie po dekodowaniu base64 |
| `MAX_LEAD_ATTACHMENTS_TOTAL_BYTES` | 4 000 000 | suma zdjęć w jednym zgłoszeniu |

Pomocnicze: `LEAD_ATTACHMENT_TYPES`, `LeadAttachmentSchema`, `base64ByteLength()`.

**Dlaczego base64 w JSON, a nie `multipart/form-data`:** oba endpointy czytają
`request.json()`. Multipart wymagałby zmiany po obu stronach **jednocześnie** —
a przy takim wdrożeniu aplikacja sprzed zmiany odrzucałaby wszystkie zgłoszenia.
Opcjonalne pole w JSON jest wstecznie zgodne: `z.object()` po stronie Workera
strippuje nieznane klucze, więc **dzisiejsza produkcyjna aplikacja przyjmie
payload ze zdjęciami i po prostu je zignoruje** (sprawdzone na zod 4.4.3, tej
samej wersji w obu repo). Koszt: +33% rozmiaru, skompensowany kompresją
w przeglądarce.

### 2.2 Nowy komponent — `components/forms/photo-attachments.tsx`

Cała robota dzieje się w przeglądarce, **zanim** cokolwiek poleci na serwer:

1. `createImageBitmap` (fallback `<img>` + `blob:` URL) — dekodowanie,
2. skalowanie do 1600 px dłuższej krawędzi na `<canvas>`,
3. `canvas.toBlob('image/webp', 0.82)`, fallback `image/jpeg`,
4. `FileReader` → base64 bez prefiksu.

Typowe zdjęcie z telefonu 4–8 MB schodzi do ~120–250 kB. Limity z kontraktu są
**zabezpieczeniem serwera**, nie docelowym rozmiarem.

UI: przycisk „Dodaj zdjęcia", miniatury 80×80 z przyciskiem usuwania, licznik
sztuk i łącznego rozmiaru, komunikaty błędów w `aria-live="polite"`, warianty
`light`/`dark`, tłumaczenia PL/EN/UA. `<input type="file">` **nie ma atrybutu
`name`** — formularze wysyłają JSON, więc plik celowo nie jest częścią `FormData`.
`blob:` URL-e są zwalniane przy usunięciu zdjęcia i przy odmontowaniu formularza.

Pliki, których przeglądarka nie umie zdekodować (np. HEIC poza Safari), są
odrzucane z komunikatem „zapisz jako JPG lub PNG" — zamiast wysyłać kilkanaście
MB oryginału.

### 2.3 Formularze

`ContactForm` i `InquiryForm` trzymają zdjęcia w `useState`, a do payloadu
dokładają `attachments: toLeadAttachments(photos)` (`undefined`, gdy nie ma
zdjęć — czyli payload identyczny jak przed zmianą).

### 2.4 Mail — `app/api/contact/route.ts`, `lib/contact/*`

- guard na `content-length` **przed** `request.json()` → 413 dla za dużego ciała,
- base64 → `Buffer` → załączniki nodemailera (`filename` czyszczony z `\r\n"\\/:*?<>|`, bo trafia do nagłówka MIME),
- mail do butiku dostaje zdjęcia **jako załączniki** + wiersz „Zdjęcia: N w załączniku: …" w sekcji kontekstu,
- **jeśli mail z załącznikami się nie powiedzie, jest ponawiany bez nich** — limit rozmiaru wiadomości po stronie SMTP nie może skasować całego zgłoszenia,
- autoodpowiedź do klienta idzie **bez** załączników (klient ma te zdjęcia u siebie, lekki mail dochodzi pewniej),
- odpowiedź: `delivery.attachments: boolean` (nowe, opcjonalne pole w `LeadResponseSchema`).

### 2.5 RODO

`/polityka-prywatnosci` §2 wymienia teraz „opcjonalnie dołączone przez
użytkownika zdjęcia" i zaznacza, że jest to dobrowolne. Komponent pokazuje pod
miniaturami: „Zdjęcia trafiają wyłącznie do butiku razem z Twoim zgłoszeniem."

### 2.6 Co przetestowano lokalnie (`next start` + POST na `/api/contact`)

| Przypadek | Wynik |
|---|---|
| zgłoszenie bez zdjęć | 200, `attachments: false` |
| 3 zdjęcia | 200, `attachments: true` |
| 6 zdjęć (limit 5) | 422 |
| `type: image/gif` | 422 |
| `data:` prefix zamiast czystego base64 | 422 |
| jedno zdjęcie > 1,5 MB | 422 |
| suma > 4 MB | 413 (guard `content-length`) |
| honeypot `company` wypełniony | 422 |

---

## 3. Co trzeba zrobić w aplikacji (`app_warszawskiczas`)

Dopóki tego nie ma, **strona działa poprawnie** — zdjęcia dochodzą mailem,
a aplikacja zapisuje lead bez zdjęć. Nie ma stanu, w którym lead ginie.

Dobra wiadomość: **nie trzeba nowych bindingów w `wrangler.jsonc`.** Wszystko
jest już podpięte — R2 `PRODUCTS_BUCKET` i Cloudflare Images `IMAGES`.

Wzorcem jest **istniejąca obsługa zdjęć zleceń serwisowych** — te same problemy
zostały tam już rozwiązane (prywatny R2, klucz nieodgadywalny, serwowanie przez
trasę za Cloudflare Access). Kopiuj z:

- `src/server/order-photos.ts`,
- `app/internal/orders/[id]/photos/route.ts`,
- `app/internal/orders/[id]/photos/[photoId]/route.ts`,
- `migrations/0017_service_only.sql` (DDL `order_photos`).

### Krok 1 — kontrakt

W `src/contracts/lead.ts` dopisz **dokładnie to samo** co w
`from-cms/schemas/lead.ts` §2.1 (to samo `LeadAttachmentSchema`, te same trzy
stałe, ten sam `.refine()` na sumę bajtów). Rozjazd limitów = ciche odrzucanie
zgłoszeń, które strona uznała za poprawne.

### Krok 2 — migracja `migrations/0020_lead_attachments.sql`

```sql
-- Zdjęcia dołączone do zgłoszenia z formularza. Osobna tabela, bo zdjęć bywa kilka.
-- Trzymamy sam klucz R2, bez publicznego URL-a: to zdjęcie cudzej własności,
-- więc serwujemy je trasą /internal/leads/[id]/attachments/[attachmentId]
-- chronioną przez Cloudflare Access, a NIE z publicznego CDN-u.
CREATE TABLE IF NOT EXISTS lead_attachments (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_name TEXT,
  byte_size INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_attachments_lead
  ON lead_attachments(lead_id, sort_order, created_at);
```

Wdrożenie:

```bash
wrangler d1 execute warszawskiczas-cms-test --file migrations/0020_lead_attachments.sql   # najpierw test
wrangler d1 execute warszawskiczas-cms      --file migrations/0020_lead_attachments.sql   # potem prod
```

### Krok 3 — `src/server/lead-attachments.ts`

Odpowiednik `order-photos.ts`:

- `getLeadAttachmentBucket()` → `env.PRODUCTS_BUCKET`,
- `buildLeadAttachmentKey(leadId, attachmentId)` → `` `leads/${leadId}/${attachmentId}.webp` `` (losowe UUID w kluczu = nie da się zgadnąć adresu),
- `putLeadAttachment()` z `httpMetadata: { contentType, cacheControl: 'private, max-age=3600' }`,
- `insertLeadAttachment()`, `listLeadAttachments()`, `getLeadAttachment()`,
- `deleteLeadAttachmentObjectQuietly()` — jak przy zleceniach: nieudane sprzątanie R2 nie może wywrócić operacji na bazie.

### Krok 4 — `app/api/v1/leads/route.ts`

Trzy zmiany, w tej kolejności:

1. **Guard rozmiaru przed `request.json()`** — ten sam wzór co na stronie:

```ts
const declared = Number(request.headers.get('content-length') ?? '0')
if (Number.isFinite(declared) && declared > MAX_REQUEST_BYTES) {
  return NextResponse.json({ ok: false, error: 'Zgłoszenie jest za duże.' }, { status: 413, headers })
}
```

2. **Zapis zdjęć PO `createLead`, best-effort.** Krytyczne: lead jest już
   w bazie, a strona traktuje odpowiedź inną niż `{ ok: true }` jako awarię
   całego kanału. Nieudany upload zdjęcia **nie może** zamienić zapisanego leada
   w błąd — złap wyjątek, zaloguj i leć dalej:

```ts
let attachmentsSaved = 0
if (parsed.payload.attachments?.length) {
  try {
    attachmentsSaved = await storeLeadAttachments(db, lead.id, parsed.payload.attachments)
  } catch (error) {
    console.error('[leads] attachment upload failed', error)   // lead zostaje, zdjęcia nie
  }
}
```

3. **`delivery.attachments`** w odpowiedzi (`attachmentsSaved > 0`) — pole jest
   już w `LeadResponseSchema` po obu stronach.

Wewnątrz `storeLeadAttachments` przepuść bajty przez binding `IMAGES` tak jak
robi to `optimizeProductImage` w `src/server/product-image-optimization.ts` —
wariant `medium` w zupełności wystarcza, a przy okazji **normalizuje wejście do
WebP i weryfikuje, że to naprawdę obraz**. Kolejność jak przy zleceniach: najpierw
`bucket.put`, potem `INSERT`; gdy `INSERT` padnie — `deleteLeadAttachmentObjectQuietly`,
żeby nie zostawić osieroconego pliku w R2.

### Krok 5 — trasa serwująca zdjęcie

`app/internal/leads/[id]/attachments/[attachmentId]/route.ts`, jeden do jednego
jak przy zleceniach, tylko z uprawnieniem `leads`:

```ts
const access = await gateRequest(request, 'leads')
if (access.blocked) return access.blocked
// ... bucket.get(row.r2_key)
return new Response(object.body, {
  headers: {
    'content-type': row.content_type,
    // `private`, bo to zdjęcie zegarka klienta — nie ma prawa trafić do cache współdzielonego.
    'cache-control': 'private, max-age=3600',
  },
})
```

**Nie serwuj tych zdjęć z `cdn.camalio.pl`.** Publiczny CDN jest dla katalogu;
zdjęcie przysłane przez klienta jest jego własnością i nie może być publiczne.

### Krok 6 — UI leada

W `app/formularze/[id]/lead-editor.tsx` dołóż galerię miniatur pod treścią
wiadomości (`<img src={/internal/leads/${id}/attachments/${attachmentId}}>`),
z powiększeniem po kliknięciu. Warto też pokazać liczbę zdjęć na liście leadów
(`listLeads` w `src/server/leads.ts` — dołóż `COUNT` podzapytaniem albo osobny
`SELECT lead_id, COUNT(*)`).

### Krok 7 — WhatsApp (opcjonalne)

CallMeBot wysyła wyłącznie tekst — **zdjęcia przez ten kanał nie przejdą**.
Realne minimum to dopisek w `buildWhatsAppMessage` (`src/server/notifications.ts`):

```
Zdjecia: 3 (w aplikacji)
```

Wymaga przekazania liczby zdjęć do `sendLeadNotifications` — dziś funkcja
dostaje sam `NormalizedLead`, więc dołóż trzeci argument albo pole do obiektu
leada. Jeśli kiedyś zdjęcia mają iść realnie na WhatsAppa, potrzebna jest
zmiana dostawcy na WhatsApp Cloud API (CallMeBot tego nie umie).

### Krok 8 — retencja

`lead_attachments` rośnie w nieskończoność, a to dane osobowe. Przy `softDeleteLead`
zdjęcia dziś **zostaną** w R2. Do decyzji biznesowej: kasować razem z leadem,
czy cyklicznie po X miesiącach. Cokolwiek wybierzesz, powinno to być spójne
z §5 polityki prywatności (okres przechowywania).

---

## 4. Punkty krytyczne — co sprawdzone i na co uważać

| Ryzyko | Status |
|---|---|
| Aplikacja sprzed zmiany dostaje nieznane pole `attachments` | **Bezpieczne.** `z.object()` w zod 4.4.3 strippuje nieznane klucze — zweryfikowane uruchomieniem. Lead zapisze się normalnie, bez zdjęć. Strona może wyjść na produkcję przed aplikacją. |
| Bump `/api/v1/` → `/api/v2/` | **Niepotrzebny.** Zmiana jest addytywna i opcjonalna. Komentarz w `from-cms/schemas/lead.ts` doprecyzowano: bumpu wymaga zmiana łamiąca, nie każde nowe pole. |
| CORS na `api.camalio.pl` | **Bez zmian.** Nadal `application/json`, a `Access-Control-Allow-Headers: Content-Type` już to pokrywa. Multipart wymusiłby rewizję — kolejny powód, dla którego go nie ma. |
| Zdjęcie z telefonu 8 MB wywraca żądanie | **Nie dojdzie do serwera** — kompresja w przeglądarce, a nad nią trzy limity kontraktu. |
| Bot wysyła gigantyczny payload | 413 z `content-length` **przed** parsowaniem JSON-a na `/api/contact`; ten sam guard trzeba dołożyć w Workerze (krok 4.1). |
| Załącznik wywraca maila do butiku (limit SMTP) | Ponowienie bez załączników — zgłoszenie zawsze dochodzi. |
| Zdjęcia klienta w publicznym cache | Trasa `internal` + `cache-control: private` + nieodgadywalny klucz R2 (krok 5). |
| Rate limit CMS-a: 5 zgłoszeń/min/IP | Wystarcza, ale teraz jedno zgłoszenie to do 4 MB zamiast kilku kB. Rozważ obniżenie do 3/min albo budżet bajtowy w `incrementLeadRateLimit`. |
| Rozjazd `from-cms/schemas/lead.ts` ↔ `src/contracts/lead.ts` | **Jedyne realne źródło konfliktu.** Limity muszą być identyczne w obu repo. |
| Nazwa pliku w nagłówku MIME | Czyszczona z `\r\n` i znaków ścieżki (`safeFilename` w `app/api/contact/route.ts`). |
| RODO | Polityka prywatności §2 zaktualizowana. Zostaje decyzja o retencji (krok 8). |

---

## 5. Kolejność wdrożenia

1. **Teraz:** strona (to repo). Zdjęcia zaczynają chodzić mailem; aplikacja je ignoruje.
2. **Potem:** aplikacja, kroki 1–6. Od deployu Workera zdjęcia lądują też w CRM.
3. **Na końcu (opcjonalnie):** WhatsApp (krok 7) i retencja (krok 8).

Nie ma między tymi etapami stanu, w którym coś jest zepsute — kolejność wynika
wyłącznie z tego, kiedy zdjęcia zaczną być widoczne w aplikacji.
