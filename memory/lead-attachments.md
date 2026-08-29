---
name: lead-attachments
description: Formularz wysyła opcjonalne zdjęcia (base64 w JSON); strona i CMS obsługują je end-to-end od 2026-08-29
metadata:
  type: project
  updated: 2026-08-29
---

Od 2026-08-29 `LeadPayloadSchema` ma opcjonalne `attachments: [{name, type, data(base64)}]` (limity: 5 szt., 1.5 MB/szt., 4 MB łącznie). Zdjęcia są kompresowane w przeglądarce (`components/forms/photo-attachments.tsx`, 1600 px → WebP q0.82) i lecą tym samym JSON-em do obu kanałów `submitLead()`.

**Strona: gotowa.** `/api/contact` dokłada je jako załączniki do maila do butiku (z ponowieniem bez załączników, gdy SMTP odrzuci rozmiar) i ma guard 413 na `content-length`. Formularze: `ContactForm` (/kontakt) + `InquiryForm` (/uslugi/skup, /komis, /naprawa-i-serwis).

**Aplikacja (`app_warszawskiczas`): gotowa i wdrożona 2026-08-29.** Migracja `0020_lead_attachments.sql` zastosowana na `warszawskiczas-cms-test` i `warszawskiczas-cms`. Zdjęcia idą przez binding `IMAGES` (wariant `medium`, normalizacja do WebP + weryfikacja, że to obraz), lądują w R2 pod `leads/<leadId>/<uuid>.webp` i są serwowane trasą `/internal/leads/[id]/attachments/[attachmentId]` za Cloudflare Access — nigdy z `cdn.camalio.pl`. Zapis jest best-effort PO `createLead`: nieudany upload nie zamienia zapisanego leada w błąd. Odpowiedź niesie `delivery.attachments`.

Otwarte: **retencja**. Trasa serwująca sprawdza `deleted_at`, więc soft-delete leada odcina dostęp do zdjęć, ale pliki ZOSTAJĄ w R2 — decyzja (kasować z leadem czy cyklicznie po X miesiącach) musi być spójna z §5 polityki prywatności. WhatsApp dostaje tylko dopisek `Zdjecia: N (w aplikacji)` — CallMeBot nie umie wysyłać obrazów.

Krytyczne: `from-cms/schemas/lead.ts` i `app_warszawskiczas/src/contracts/lead.ts` muszą mieć IDENTYCZNE limity. Dodanie pola opcjonalnego NIE wymaga bumpu `/api/v1/` → `/api/v2/`. Powiązane: [[cms-website-publish-boundary]], [[private-collection-removed]].
