# Linkowanie wewnętrzne i wersje językowe

> Stan: 2026-07-21. Dokument opisuje aktualny graf linków indeksowalnych stron.

## Główne reguły

1. Każda indeksowalna strona musi mieć co najmniej jeden przychodzący link HTML z innej strony.
2. Wszystkie URL-e z sitemapy muszą być osiągalne od `/` w maksymalnie trzech przejściach.
3. Strony główne `/`, `/en` i `/ua` muszą łączyć się wzajemnie zwykłymi odnośnikami `<a href>`.
4. Zmiana języka prowadzi do odpowiednika bieżącej strony, a nie zawsze do strony głównej.
5. Linki globalnego hubu są lokalizowane przez `localizePath`; kod przechowuje kanoniczne ścieżki PL.
6. Linki do wersji językowych nie są prefetchowane, aby globalna nawigacja nie pobierała dwóch dodatkowych stron przy każdym wejściu.

## Przełącznik języka

`components/layout/language-switcher.tsx` używa natywnego `<details>`. Kompaktowy element pokazuje aktywny język, a rozwinięta lista zawiera trzy komponenty Next `<Link>`.

Każdy link ma:

- lokalizowany `href`,
- `hrefLang`,
- atrybut `lang`,
- `aria-current="page"` dla aktywnego języka,
- `prefetch={false}`.

Rozwiązanie działa bez `router.push` i pozostawia linki w serwerowym HTML.

## Globalny hub w stopce

Źródłem danych jest `seoHubLinks()` w `lib/related-links.ts`. Hub występuje na każdej stronie i ma cztery grupy:

- marki — główne marki oraz Rolex/Patek Philippe/Audemars Piguet na zamówienie,
- kategorie — w tym chronografy,
- skup i usługi — w tym skup w centrum Warszawy,
- eksperci i butik — proces autentyczności, „O nas”, butik i kontakt.

Ten zestaw pokrywa wszystkie indeksowalne landingi i zapobiega ponownemu powstaniu sierot.

## Linki kontekstowe landingów

`relatedLinksFor()` zwraca sześć linków. Cztery pierwsze są dobierane według intencji strony, a dwa miejsca są zarezerwowane dla:

- `/jak-weryfikujemy-autentycznosc-zegarka`,
- `/o-nas`.

Dzięki temu informacje o doświadczeniu i procesie weryfikacji nie wypadają z listy przez limit elementów.

## Dodawanie nowej strony

Przed mergem nowej indeksowalnej trasy należy:

1. dodać ją do `publicRoutePaths`,
2. nadać self-canonical i komplet hreflang,
3. umieścić ją w odpowiedniej grupie globalnego hubu albo zapewnić inny trwały link,
4. sprawdzić odpowiedniki EN/UA,
5. wykonać `npm run verify`.

Test kończy się błędem, jeśli nowa strona jest sierotą, wersje językowe są rozłączone lub głębokość przekracza trzy.
