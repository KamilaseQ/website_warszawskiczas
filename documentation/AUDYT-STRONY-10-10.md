# Warszawski Czas — Checklista implementacyjna 10/10

> Źródło: audyt z 2026-05-18 (zachowany w historii git pod tym samym plikiem).
> Format: każdy punkt to konkretne działanie z odhaczalnym statusem.
> **Pomijamy świadomie**: wszystko zależne od CDN/R2 (obrazy, warianty, image sitemap, `ProductImage`), bo zostaną wymienione po wdrożeniu CDN.

Legenda:
- `[x]` — zrobione (zaznaczone w tym repo)
- `[ ]` — do zrobienia
- `[skip-cdn]` — czeka na wdrożenie CDN/R2, świadomie pomijane teraz
- `[skip-ext]` — wymaga zewnętrznych kont/usług (Search Console, GBP, Lighthouse runner, CMS)

---

## P0 — SEO i kontrakt, naprawić przed wzrostem ruchu

- [x] **Naprawić zdublowany suffix title** na landingach (Rolex, złoto). Title nie powinien zawierać `| Warszawski Czas` skoro template w `app/layout.tsx` doklejà go automatycznie. Sprawdzić wszystkie pliki w `app/(public)/*/page.tsx`.
- [x] **`html lang` per locale**. Strony `/en` i `/ua` muszą renderować `<html lang="en">` / `<html lang="uk-UA">`. Dziś root layout twardo wpisuje `lang="pl"`. Rozwiązanie: osobny segment layout dla `[locale]` lub wstrzyknięcie atrybutu po stronie klienta przy hydracji.
- [x] **Hero H1 — dodać spacje** między `Luksusowe`/`Zegarki`, `Luxury`/`Watches`, `Люксові`/`Годинники`. Dziś `<br/>` daje wizualny break, ale tekst odczytany ciągiem brzmi `LuksusoweZegarki`.
- [x] **Hreflang dla `/`**. Root layout musi też emitować `<link rel="alternate" hreflang>` (`pl`, `en`, `uk-UA`, `x-default`) — dziś tylko `canonical: '/'`.
- [x] **`Offer.price = 0` dla produktów `priceOnRequest`**. Usunąć `priceSpecification.price: 0` w PL i `priceCurrency: 'PLN'` bez `price` w wariancie EN/UA. Dla produktów bez ceny — emitować `Offer` bez `price`/`priceCurrency` (albo całkiem pomijać `offers` i opisać dostępność słownie).
- [x] **Animacje nie chowają statycznej treści**. `components/ui/fade-in.tsx` i `components/ui/reveal-text.tsx` renderują `opacity: 0` w SSR-owym HTML. Zamienić Framer Motion na CSS-only fade-in (animacja `wc-fade-in`) — działa od razu, respektuje `prefers-reduced-motion`, statyczny HTML jest widoczny bez JS.
- [x] **Rozdzielić `productUrlSlug` od adaptera CMS**. Czysta funkcja powinna być w `lib/products-url.ts` (albo `lib/utils.ts`) — żeby komponenty klienta nie wciągały adaptera serwerowego (`from-cms/adapters/products`) tylko po slug.
- [x] **Lead endpoint w trybie static export**. `from-cms/mode.ts` czyta `process.env.CMS_MODE`, ale w przeglądarce te wartości znikają (chyba że `NEXT_PUBLIC_*`). Dodać `NEXT_PUBLIC_CMS_LEAD_URL` i `NEXT_PUBLIC_CMS_MODE`, użyć ich w `submitLead`. Token CMS-a do produktów zostaje sekretny (build-time), token leadów nie istnieje — leady są publiczne, zabezpieczone CORS-em + rate-limit po stronie CMS.
- [skip-cdn] Obrazy — warianty AVIF/WebP, image sitemap, `ProductImage` z wariantami.
- [skip-cdn] OG image i sitemap image — weryfikacja absolutnych URL-i po migracji.

## P1 — porządki kodu i dług techniczny

- [x] **Usunąć `nodemailer` z `package.json`**. Reszta po wyrzuconym `/api/contact`. `@types/nodemailer` z devDeps też.
- [x] **`BreadcrumbList` na landingach**. Sprawdzić każdy landing w `app/(public)/*` i upewnić się, że emituje `landingBreadcrumbJsonLd`. Część ma, część nie.
- [x] **`WebSite` + `Organization` JSON-LD** w root layout. `LocalBusiness` już jest; dorzucić `Organization` (logo, sameAs, kontakt) i `WebSite` (z `SearchAction` jeśli kiedyś będzie wewnętrzny search).
- [x] **Lazy-load Google Maps na `/kontakt`**. Dziś iframe ładuje się od razu. Użyć IntersectionObserver + injection iframe.
- [ ] **`lastModified` w sitemap z `updatedAt` produktu/strony**. Dziś stała data. Dla produktów: użyj `product.updatedAt` (jeśli jest), dla landingów: data ostatniego commit-a pliku lub stała + revalidate strategia (przy SSG raz na build).
- [skip-ext] Walidacja sitemap/hreflang/JSON-LD w CI.
- [skip-ext] Lighthouse baseline (3 strony, zapisać `docs/lighthouse-baseline.md`).

## P2 — UX (mobile, katalog, karta produktu)

- [x] **Mobile hero** — H1 zmniejszony do `2.75rem` na najmniejszych ekranach, mniejsze marginesy lead-u i CTA, dzięki czemu primary CTA mieści się na pierwszym ekranie iPhone-a SE.
- [ ] Statyczny poster wideo na pierwsze 200 ms (czeka na re-encode wideo / CDN).
- [x] **Karta produktu mobile — sticky bottom CTA** (`Zapytaj o ...` + telefon) na PL i EN/UA. Ukryte od `sm` w górę.
- [x] **Loader respektuje `prefers-reduced-motion: reduce`** — całkowicie pomijany dla użytkowników z włączoną redukcją animacji.
- [x] **Katalog — produkty widoczne bez czekania na JS**. Usunięta entrance-animation z `motion.div` (`opacity:0` → `1`) na `ProductCatalog` i `RelatedGrid`; podobnie tekstowy blok w `ProductCard`. Treść w statycznym HTML jest od razu widoczna.
- [ ] Sticky filtr/sort i search-by-marka w katalogu — wymaga decyzji UX.
- [ ] Focus management w drawer/mobile menu — osobna runda a11y.

## P3 — Content i autorytet (długoterminowe)

> Wymagają decyzji biznesowych i pracy content writera. Lista jako briefing.

- [x] **Hub Patek Philippe** — `/zegarki-patek-philippe-warszawa` z opisem Nautilus, Aquanaut, Calatrava, Annual Calendar, Twenty~4, kalibrów manufakturowych, FAQ i bullet list referencji.
- [x] **Hub Audemars Piguet** — `/zegarki-audemars-piguet-warszawa` z Royal Oak 15500/15510/15400, Jumbo 16202, Offshore 26238, Code 11.59, kalibrami 3120/4302/4401, FAQ.
- [x] **Hub Breitling** — `/zegarki-breitling-warszawa` z Navitimer, Superocean, Chronomat, Premier, Top Time Classic Cars, kalibrami B01/B20.
- [x] **Strona procesowa autentyczności** — `/jak-weryfikujemy-autentycznosc-zegarka` z 8-etapowym procesem ekspertyzy (wizualna ocena → fotografia → oznaczenia → mechanizm → pomiary chronometryczne → dokumenty → Service Center → certyfikat). Buduje E-E-A-T.
- [x] **Strona `/o-nas`** — historia butiku, zespół, lokalizacja (Mokotowska 71), proces zakupu/sprowadzania/skupu, marki, godziny otwarcia, dostępne języki. `AboutPage` + `Organization` w schema. Buduje E-E-A-T.
- [x] **Cross-linki — systematyzacja przez `lib/related-links.ts`**. Każdy landing dostaje teraz spójny zestaw 6 linków zależnych od kategorii (`brand-hub`, `category-hub`, `service-hub`, `on-request`, `process`, `about`). Helper `relatedLinksFor(slug, category)` wyklucza sam siebie. Linkowanie pokrywa: katalog, główny hub luxury, 3–4 huby marek (Rolex/Patek/AP/Breitling/Omega/Cartier), `/jak-weryfikujemy-autentycznosc-zegarka` (E-E-A-T), `/o-nas` (E-E-A-T). Naprawione martwe linki w Rolex landingu.
- [x] **Sitemap + canonical** — wszystkie 5 nowych stron w sitemap z hreflang PL/EN/UA. Każda ma `localizedAlternates`, `BreadcrumbList` JSON-LD oraz `AboutPage`/`Service` JSON-LD odpowiednio.
- [x] **EN/UA wersje nowych hubów** — Patek/AP/Breitling auto-generowane przez `brandDefinition` w `lib/localized-landings.ts` (taki sam pattern jak Rolex/Omega/Cartier). `/o-nas` i `/jak-weryfikujemy-autentycznosc-zegarka` mają bespoke EN/UA bullety, FAQ, kroki, intro w `buildDefinitions`. Łącznie 10 nowych URL-i (5 stron × 2 locale).
- [x] **Treść `/o-nas` zweryfikowana z `/informacje-o-butiku`** — usunięte fabrykowane szczegóły (imiona zespołu, konkretne nazwiska zegarmistrzów, 15 lat doświadczenia, sprzęt Witschi/Sigma Test). Zostawione fakty: założenie 2019, Mokotowska 71, kontakt (+48 604 312 411, biuro@warszawskiczas.pl), social media (Facebook/Instagram/TikTok), pełen zakres usług (sprzedaż/sprowadzanie/skup/komis/serwis/biżuteria), główne marki (Rolex/Patek/AP/Omega/Cartier/Breitling). Słowa kluczowe pozostawione zgodnie z aktualną sztuką SEO.
- [x] **Treść `/jak-weryfikujemy-autentycznosc-zegarka` zweryfikowana** — usunięte fabrykowane partnerstwa (Patek Philippe Service Center / Rolex Service Center / Audemars Piguet Service jako stali partnerzy), konkretne marki sprzętu (Witschi, Sigma Test, Bergeon, OptiVisor). Zostawione: opis kroków weryfikacji, kalibry marek, oznaczenia kopert, parametry chronometryczne — wiedza branżowa pozostaje kluczem do długo-ogonowych zapytań.
- [x] **Brand huby (Patek/AP/Breitling) oczyszczone z fabrykowanej "12-mies. gwarancji butiku"** — zastąpione "pełnym wsparciem posprzedażowym" i "pełną dokumentacją egzemplarza". Service Center partnerships zmiękczone do "kierowanie do oficjalnego serwisu marki w razie potrzeby" / "Extract from the Archives w Genewie przy wartościowych egzemplarzach" (real Patek Philippe service offering).
- [ ] Huby modeli/referencji (Daytona, Submariner, Nautilus, Royal Oak, Speedmaster, Santos, Tank) — kolejna iteracja, węższe targetowanie.
- [ ] Archiwum realizacji — wymaga listy sprzedanych egzemplarzy z CMS-a.
- [ ] Dodatkowe strony procesowe — `/proces-skupu-zegarkow`, `/sprowadzanie-zegarka` jako osobne strony procesowe (dziś tylko sekcje na istniejących landingach).
- [skip-ext] Google Business Profile workflow (kategorie, zdjęcia, posty, Q&A, system pozyskiwania opinii).
- [skip-ext] Search Console — miesięczny przegląd, śledzenie pozycji klastrów.
- [skip-ext] FAQ jako tylko UX, nie strategia rich results (Google ograniczył FAQPage rich results).

## P4 — Integracje i CMS (kontrakt)

- [skip-ext] Wersjonowanie API CMS-a (`/api/v1/products`, `/api/v1/leads`, opcjonalnie `/api/v1/translations`).
- [skip-ext] Debounce/queue webhooków rebuildu (10 edycji ≠ 10 deployów).
- [skip-ext] Preview workflow / draft mode.
- [skip-ext] Last-known-good snapshot — fallback gdy CMS chwilowo down.
- [skip-ext] Monitoring leadów — alert gdy 0 leadów w 24 h.

---

## Definition of Done — kryteria 10/10 (do walidacji po wdrożeniu CDN i CMS)

SEO:
- [ ] 0 krytycznych błędów w Search Console.
- [ ] 100% indeksowalnych stron z `canonical`, kompletem `hreflang` i obecnych w sitemap.
- [ ] 100% stron produktowych przechodzi Rich Results Test bez błędów krytycznych.

UX (realne dane CrUX):
- [ ] Mobile LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- [ ] Pierwsze CTA widoczne na mobile bez frustracji.

Kod:
- [x] `npm run lint` przechodzi.
- [x] `npm run build` przechodzi.
- [ ] Komponenty klienta nie importują z `from-cms/adapters/*` (tylko z `lib/*` i `from-cms/schemas/*`).
- [x] Brak `nodemailer` po wyrzuconych route handlerach.
- [x] Animacje nie wymagają JS do pokazania treści.

Integracje:
- [ ] Lead z formularza trafia do publicznego endpointu CMS-a z kontekstem (UTM, source, product).
- [ ] CMS może przebudować stronę przez webhook bez dewelopera.

---

## Źródła zewnętrzne (do okresowego przeglądu)

- Google Search Central — SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- People-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Ecommerce SEO: https://developers.google.com/search/docs/specialty/ecommerce
- Product structured data: https://developers.google.com/search/docs/appearance/structured-data/product
- Hreflang: https://developers.google.com/search/docs/advanced/crawling/localized-versions
- Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals
- Image SEO: https://developers.google.com/search/docs/advanced/guidelines/google-images
- FAQPage (ograniczenia rich results): https://developers.google.com/search/docs/appearance/structured-data/faqpage
- AI Overviews: https://developers.google.com/search/docs/appearance/ai-overviews
