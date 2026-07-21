# Obrazy produktów i CDN

> Stan: 2026-07-21. Dokument opisuje aktualny kod strony; nie jest już planem przyszłej migracji.

## Aktualny model

- Produkty w trybie `live` otrzymują z CMS-u absolutne URL-e obrazów na `cdn.camalio.pl`.
- Fixtures używane lokalnie mogą nadal wskazywać ścieżki `/products/...`.
- `from-cms/schemas/product.ts` przechowuje obecnie obrazy jako `string[]`.
- `next.config.js` ma `images.unoptimized: true`, ponieważ optymalizator `/_next/image` wcześniej nie działał stabilnie na Hostingerze.
- `lib/cdn-image.ts` potrafi wyliczyć nazwy wariantów `thumb` i `medium` w katalogu `_variants`.
- `components/products/product-image.tsx` wraca do oryginału, gdy wyliczony wariant zwróci błąd.

## Reguły URL-i

Pełny URL rozpoczynający się od `http://` albo `https://` jest kompletnym adresem i nie może otrzymać prefiksu `warszawskiczas.pl`. Ścieżki lokalne otrzymują domenę witryny dopiero przy tworzeniu metadata lub sitemapy.

Ta reguła obowiązuje dla:

- `img src` i `srcset`,
- `og:image` i `twitter:image`,
- `image:loc` w sitemapie,
- URL-i obrazów w Product JSON-LD.

Automatyczny audyt wykrywa sklejone adresy, np. `warszawskiczas.plhttps...`.

## Warianty CDN — stan i ograniczenie

Publiczny audyt z 2026-07-20 wykazał, że część wyliczanych wariantów `_variants` nie istnieje. Przeglądarka najpierw otrzymuje 404, a następnie pobiera cięższy oryginał. Naprawa błędnych URL-i metadata nie tworzy brakujących plików na CDN.

Do czasu zmiany kontraktu CMS obowiązują następujące zasady:

1. Oryginalny URL z CMS-u jest źródłem prawdy.
2. Brak wariantu nie może powodować niedostępności zdjęcia.
3. Nowy kod nie może dokładać kolejnych konwencji nazewniczych `_variants`.
4. Przed publikacją produktu należy sprawdzić dostępność oczekiwanych wariantów.

## Docelowy kontrakt

Preferowany format obrazu w przyszłej wersji API CMS:

```json
{
  "original": "https://cdn.camalio.pl/products/example/photo.jpg",
  "thumb": "https://cdn.camalio.pl/products/example/_variants/photo-thumb.webp",
  "medium": "https://cdn.camalio.pl/products/example/_variants/photo-medium.webp",
  "width": 1800,
  "height": 2400,
  "alt": "Rolex Submariner — widok tarczy"
}
```

Po wdrożeniu takiego kontraktu strona powinna używać tylko jawnie przekazanych wariantów. Zgadywanie ścieżki będzie można usunąć po okresie kompatybilności ze starym `string[]`.

## Alternatywa: optymalizator Next.js

Pakiet `sharp` znajduje się obecnie w zależnościach projektu. Można ponownie sprawdzić `images.unoptimized: false` na środowisku testowym Hostingera. Zmiany nie należy włączać bez potwierdzenia odpowiedzi 200 z `/_next/image` i pomiaru obciążenia procesu Node.

## Weryfikacja

```bash
npm run check:images
npm run verify:seo
```

Kontrola lokalna sprawdza składnię adresów wygenerowanych przez build. Kontrola faktycznej dostępności plików CDN wymaga osobnego testu sieciowego przeciwko danym `live`.
