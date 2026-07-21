# Obrazy produktów i CDN

> Stan kodu: 2026-07-21. Nowy kontrakt jest zaimplementowany lokalnie; produkcja wymaga wdrożenia strony, aplikacji, publikacji nowego snapshotu i opcjonalnego backfillu.

## Źródło danych

Strona akceptuje dwa zgodne formaty:

1. `imageAssets` — preferowany, jawny kontrakt `original/thumb/medium/alt`.
2. `images: string[]` — format przejściowy dla fixtures i starszych snapshotów.

Przykład:

```json
{
  "imageAssets": [
    {
      "original": "https://cdn.camalio.pl/products/example/photo.jpg",
      "thumb": "https://cdn.camalio.pl/products/example/_variants/photo-thumb.webp",
      "medium": "https://cdn.camalio.pl/products/example/_variants/photo-medium.webp",
      "alt": "Rolex Submariner"
    }
  ],
  "images": ["https://cdn.camalio.pl/products/example/photo.jpg"]
}
```

Schemat wymaga adresów HTTP(S), niepustego altu oraz obu wariantów albo żadnego. Niepełny obiekt zostaje odrzucony podczas builda, zanim trafi na produkcję.

## Odczytowy audyt obecnej produkcji

Audyt wykonany 2026-07-21 przed wdrożeniem tych zmian wykazał:

- 49 publicznych stron produktów,
- 156 unikalnych oryginałów CDN — wszystkie zwracają poprawny obraz,
- 193 warianty żądane przez aktualny HTML, z czego 97 zwraca 404,
- 441 wystąpień sklejonych URL-i obrazu w sitemapie/metadata starego deployu,
- brak znaczników `<img>` bez atrybutu `alt`.

To oznacza, że dane źródłowe zegarków nie zniknęły. Problemem są brakujące warianty i stary kod produkcyjny, który je zgaduje. Nowy kontrakt usuwa zgadywanie, a backfill z repo aplikacji może uzupełnić pliki.

## Zachowanie renderowania

- `imageAssets` ma pierwszeństwo przed `images`.
- Jawny `thumb` jest używany w małych miniaturach; `medium` na kartach, w galerii i lightboxie.
- Jeżeli jawny obiekt nie ma wariantów, strona od razu używa `original` i nie wysyła żądania pod zgadywany URL.
- Dla starego `images[]` nadal działa wyliczenie `_variants` oraz klientowy fallback do oryginału po błędzie.
- Zmiana aktywnego zdjęcia w galerii resetuje źródło logicznie, więc błąd jednego obrazu nie zatruwa kolejnych slajdów.
- Alt z CMS-u jest używany dla widocznego obrazu. Gdy go nie ma w starym formacie, fallback to `<marka> <nazwa>`.
- Miniatury nawigacyjne mają `alt=""`, ponieważ ich przycisk posiada osobną etykietę i powtarzanie opisu byłoby zbędne dla czytnika ekranu.

## Metadata i SEO

Oryginalny URL jest używany w:

- `og:image` i `twitter:image`,
- Product JSON-LD,
- `image:loc` w sitemapie.

Pełny adres CDN nie otrzymuje prefiksu domeny witryny. Automatyczny audyt odrzuca sklejone URL-e typu `warszawskiczas.plhttps...` i znaczniki `<img>` bez atrybutu `alt`.

## Dlaczego `images.unoptimized: true` pozostaje

Produkcyjny optymalizator `/_next/image` był niestabilny na Hostingerze, dlatego strona nie przetwarza obrazów w locie. Wydajność zapewniają gotowe WebP z R2/CDN. Nie należy przełączać tej opcji bez osobnego testu środowiska staging, odpowiedzi 200 z `/_next/image` i pomiaru obciążenia Node.

## Wdrożenie i wycofanie

Bezpieczna kolejność:

1. wdrożyć stronę obsługującą oba formaty,
2. wdrożyć aplikację generującą warianty i publikującą `imageAssets`,
3. dodać testowe zdjęcie z telefonu,
4. opublikować nowy snapshot,
5. uruchomić backfill starszych rekordów z instrukcji w repo aplikacji,
6. ponownie opublikować snapshot.

Rollback strony to revert commita: pole `images` nadal istnieje. Rollback aplikacji również nie wymaga migracji. Backfill ma journal i cofa `has_variants` do `0`, nie dotykając oryginałów.

## Weryfikacja

```bash
npm run lint
npm run build
npm run verify:seo
npm run check:images -- --base-url https://warszawskiczas.pl
npm run audit:cdn-images
```

Po pełnym wdrożeniu crawl produkcyjny powinien wykazać: zero błędnych URL-i obrazu, zero brakujących atrybutów alt, brak żądań 404 do `_variants` dla danych z `imageAssets`, odpowiedzi CDN `200`, `Content-Type: image/webp` dla wariantów i poprawny cache przy drugim żądaniu.
