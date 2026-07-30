# Obrazy produktów i CDN

> Stan: 2026-07-30. Historyczne warianty są obecne w produkcyjnym R2/D1. Aktualny build strony nadal wymaga wdrożenia i publikacji nowego snapshotu.

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

Audyt bazowy wykazał 107 niedostępnych adresów wariantów w pełnym crawl’u. Stary build strony zgadywał ich nazwy, otrzymywał 404 i dopiero wtedy pobierał wielomegabajtowy oryginał.

Po backfillu z 2026-07-29:

- 49 publicznych stron produktów,
- 353 unikalne adresy CDN: 158 oryginałów i 195 wariantów,
- 195 obrazów renderowanych przez HTML: wszystkie są wariantami,
- 0 odpowiedzi 404 i 0 błędów renderowanych obrazów,
- wszystkie warianty mają roczny, niemutowalny cache,
- mediana wariantu to 27,4 KiB, p95 250,7 KiB, maksimum 479,8 KiB,
- żaden wariant nie przekracza budżetu 600 KiB.

Aktualny deploy przestał wpadać w ciężkie fallbacki dzięki uzupełnionym obiektom R2. Wdrożenie kodu strony jest nadal potrzebne, aby używać jawnego `imageAssets`, małych `thumb` w katalogu oraz priorytetu pierwszego obrazu.

Końcowy pomiar laboratoryjny Lighthouse Mobile na produkcyjnym buildzie z 65
kartami (lokalny `CMS_MODE=mock`) uzyskał 82/100 wydajności oraz 100/100 dla
dostępności, dobrych praktyk i SEO. Pierwsze wejście pobrało 7 obrazów o łącznym
transferze 102,5 KiB, a CLS wyniósł 0,001. To pomiar laboratoryjny, nie dane
terenowe Core Web Vitals z realnych urządzeń.

## Zachowanie renderowania

- `imageAssets` ma pierwszeństwo przed `images`.
- Pierwsza karta katalogu używa pojedynczego `thumb` jako obrazu priorytetowego.
  Pozostałe karty nie montują nawet znacznika `<img>`, dopóki nie znajdą się
  maksymalnie 800 px od viewportu; po zamontowaniu nadal używają pojedynczego
  `thumb` i natywnego `loading="lazy"`.
  Katalog celowo nie emituje `srcset` `thumb`/`medium`: na ekranach DPR 2×/3×
  przeglądarka pobierałaby cięższy `medium` dla niemal każdej karty.
- Galeria i lightbox używają `medium`.
- Jeżeli jawny obiekt nie ma wariantów, strona od razu używa `original` i nie wysyła żądania pod zgadywany URL.
- Dla starego `images[]` nadal działa wyliczenie `_variants` oraz klientowy fallback do oryginału po błędzie.
- Zmiana aktywnego zdjęcia w galerii resetuje źródło logicznie, więc błąd jednego obrazu nie zatruwa kolejnych slajdów.
- Alt z CMS-u jest używany dla widocznego obrazu. Gdy go nie ma w starym formacie, fallback to `<marka> <nazwa>`.
- Miniatury nawigacyjne mają `alt=""`, ponieważ ich przycisk posiada osobną etykietę i powtarzanie opisu byłoby zbędne dla czytnika ekranu.

## Metadata i SEO

Jawny `medium` jest używany w `og:image`, `twitter:image`, Product JSON-LD oraz
`image:loc` w sitemapie. Dla starego `images: string[]` SEO zachowuje oryginał,
bo metadane nie mają klientowego `onError` i nie mogą bezpiecznie zgadywać URL-a
wariantu.

Pełny adres CDN nie otrzymuje prefiksu domeny witryny. Automatyczny audyt odrzuca sklejone URL-e typu `warszawskiczas.plhttps...` i znaczniki `<img>` bez atrybutu `alt`.

## Dlaczego `images.unoptimized: true` pozostaje

Produkcyjny optymalizator `/_next/image` był niestabilny na Hostingerze, dlatego strona nie przetwarza obrazów w locie. Wydajność zapewniają gotowe WebP z R2/CDN. Nie należy przełączać tej opcji bez osobnego testu środowiska staging, odpowiedzi 200 z `/_next/image` i pomiaru obciążenia Node.

## Wdrożenie i wycofanie

Bezpieczna kolejność:

1. wdrożyć stronę obsługującą oba formaty, `thumb` w katalogu i priorytet pierwszego obrazu,
2. opublikować nowy snapshot,
3. dodać testowe zdjęcie z telefonu,
4. uruchomić testy i ponowny audyt CDN.

Backfill starszych rekordów jest już wykonany. Kod aplikacji generujący warianty
jest zaimplementowany i zweryfikowany, ale nadal wymaga wdrożenia.

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
