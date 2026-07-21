/**
 * Spójny system linków powiązanych dla landingów SEO.
 *
 * Każdy landing należy do jednej z kategorii — `brand-hub`, `category-hub`,
 * `service-hub`, `process`, `about`. Helper `relatedLinksFor(slug, category)`
 * zwraca przewidywalną listę 6–8 linków dla danej kategorii, z wyłączeniem
 * samego siebie (`slug`). Linkowanie jest zoptymalizowane pod:
 *   - link equity (kluczowe huby otrzymują linki z każdej strony),
 *   - intencję użytkownika (brand → marki siostrzane + skup + serwis),
 *   - E-E-A-T (każda strona dostaje link do /o-nas + /jak-weryfikujemy-...).
 *
 * Helper jest używany przez PL landingi (każdy plik app/(public)/SLUG/page.tsx)
 * oraz przez EN/UA generator w lib/localized-landings.ts.
 */

export type LandingCategory =
  | 'brand-hub'
  | 'category-hub'
  | 'service-hub'
  | 'on-request'
  | 'process'
  | 'about'

type RelatedLink = { href: string; label: string }

const L = {
  pl: {
    catalogue: { href: '/produkty', label: 'Cały katalog' },
    luxury: { href: '/zegarki-luksusowe-warszawa', label: 'Zegarki luksusowe Warszawa' },
    preowned: { href: '/zegarki-uzywane-warszawa', label: 'Zegarki używane' },
    onRequest: { href: '/zegarki-na-zamowienie', label: 'Zegarki na zamówienie' },
    collector: { href: '/zegarki-kolekcjonerskie', label: 'Zegarki kolekcjonerskie' },
    rolex: { href: '/zegarki-rolex-warszawa', label: 'Zegarki Rolex' },
    patek: { href: '/zegarki-patek-philippe-warszawa', label: 'Zegarki Patek Philippe' },
    ap: { href: '/zegarki-audemars-piguet-warszawa', label: 'Zegarki Audemars Piguet' },
    breitling: { href: '/zegarki-breitling-warszawa', label: 'Zegarki Breitling' },
    omega: { href: '/zegarki-omega-warszawa', label: 'Zegarki Omega' },
    cartier: { href: '/zegarki-cartier-warszawa', label: 'Zegarki Cartier' },
    rolexOR: { href: '/rolex-na-zamowienie', label: 'Rolex na zamówienie' },
    patekOR: { href: '/patek-philippe-na-zamowienie', label: 'Patek Philippe na zamówienie' },
    apOR: { href: '/audemars-piguet-na-zamowienie', label: 'Audemars Piguet na zamówienie' },
    chronos: { href: '/chronografy-warszawa', label: 'Chronografy' },
    gold: { href: '/zegarki-ze-zlota-warszawa', label: 'Zegarki ze złota' },
    diamond: { href: '/zegarki-z-diamentami-warszawa', label: 'Zegarki z diamentami' },
    ladies: { href: '/zegarki-damskie-warszawa', label: 'Zegarki damskie' },
    skup: { href: '/skup-zegarkow-warszawa', label: 'Skup zegarków Warszawa' },
    skupRolex: { href: '/skup-rolex-warszawa', label: 'Skup Rolex Warszawa' },
    skupCentrum: { href: '/skup-zegarkow-centrum-warszawy', label: 'Skup w centrum Warszawy' },
    wycena: { href: '/wycena-zegarka-warszawa', label: 'Wycena zegarka' },
    komis: { href: '/komis-zegarkow-warszawa', label: 'Komis zegarków' },
    serwis: { href: '/uslugi/naprawa-i-serwis', label: 'Serwis i naprawy' },
    auth: { href: '/jak-weryfikujemy-autentycznosc-zegarka', label: 'Jak weryfikujemy autentyczność' },
    about: { href: '/o-nas', label: 'O butiku' },
    boutique: { href: '/butik', label: 'Butik Mokotowska 71' },
    contact: { href: '/kontakt', label: 'Kontakt' },
  },
  en: {
    catalogue: { href: '/produkty', label: 'Watch catalogue' },
    luxury: { href: '/zegarki-luksusowe-warszawa', label: 'Luxury watches Warsaw' },
    preowned: { href: '/zegarki-uzywane-warszawa', label: 'Pre-owned watches' },
    onRequest: { href: '/zegarki-na-zamowienie', label: 'Watches on request' },
    collector: { href: '/zegarki-kolekcjonerskie', label: 'Collector watches' },
    rolex: { href: '/zegarki-rolex-warszawa', label: 'Rolex watches' },
    patek: { href: '/zegarki-patek-philippe-warszawa', label: 'Patek Philippe watches' },
    ap: { href: '/zegarki-audemars-piguet-warszawa', label: 'Audemars Piguet watches' },
    breitling: { href: '/zegarki-breitling-warszawa', label: 'Breitling watches' },
    omega: { href: '/zegarki-omega-warszawa', label: 'Omega watches' },
    cartier: { href: '/zegarki-cartier-warszawa', label: 'Cartier watches' },
    rolexOR: { href: '/rolex-na-zamowienie', label: 'Rolex on request' },
    patekOR: { href: '/patek-philippe-na-zamowienie', label: 'Patek Philippe on request' },
    apOR: { href: '/audemars-piguet-na-zamowienie', label: 'Audemars Piguet on request' },
    chronos: { href: '/chronografy-warszawa', label: 'Chronographs' },
    gold: { href: '/zegarki-ze-zlota-warszawa', label: 'Gold watches' },
    diamond: { href: '/zegarki-z-diamentami-warszawa', label: 'Diamond watches' },
    ladies: { href: '/zegarki-damskie-warszawa', label: 'Ladies watches' },
    skup: { href: '/skup-zegarkow-warszawa', label: 'Sell luxury watches' },
    skupRolex: { href: '/skup-rolex-warszawa', label: 'Sell Rolex' },
    skupCentrum: { href: '/skup-zegarkow-centrum-warszawy', label: 'Sell in central Warsaw' },
    wycena: { href: '/wycena-zegarka-warszawa', label: 'Watch valuation' },
    komis: { href: '/komis-zegarkow-warszawa', label: 'Watch consignment' },
    serwis: { href: '/uslugi/naprawa-i-serwis', label: 'Repair & service' },
    auth: { href: '/jak-weryfikujemy-autentycznosc-zegarka', label: 'How we authenticate' },
    about: { href: '/o-nas', label: 'About the boutique' },
    boutique: { href: '/butik', label: 'Boutique Mokotowska 71' },
    contact: { href: '/kontakt', label: 'Contact' },
  },
  ua: {
    catalogue: { href: '/produkty', label: 'Каталог годинників' },
    luxury: { href: '/zegarki-luksusowe-warszawa', label: 'Люксові годинники у Варшаві' },
    preowned: { href: '/zegarki-uzywane-warszawa', label: 'Вживані годинники' },
    onRequest: { href: '/zegarki-na-zamowienie', label: 'Годинники на замовлення' },
    collector: { href: '/zegarki-kolekcjonerskie', label: 'Колекційні годинники' },
    rolex: { href: '/zegarki-rolex-warszawa', label: 'Годинники Rolex' },
    patek: { href: '/zegarki-patek-philippe-warszawa', label: 'Годинники Patek Philippe' },
    ap: { href: '/zegarki-audemars-piguet-warszawa', label: 'Годинники Audemars Piguet' },
    breitling: { href: '/zegarki-breitling-warszawa', label: 'Годинники Breitling' },
    omega: { href: '/zegarki-omega-warszawa', label: 'Годинники Omega' },
    cartier: { href: '/zegarki-cartier-warszawa', label: 'Годинники Cartier' },
    rolexOR: { href: '/rolex-na-zamowienie', label: 'Rolex на замовлення' },
    patekOR: { href: '/patek-philippe-na-zamowienie', label: 'Patek Philippe на замовлення' },
    apOR: { href: '/audemars-piguet-na-zamowienie', label: 'Audemars Piguet на замовлення' },
    chronos: { href: '/chronografy-warszawa', label: 'Хронографи' },
    gold: { href: '/zegarki-ze-zlota-warszawa', label: 'Золоті годинники' },
    diamond: { href: '/zegarki-z-diamentami-warszawa', label: 'Годинники з діамантами' },
    ladies: { href: '/zegarki-damskie-warszawa', label: 'Жіночі годинники' },
    skup: { href: '/skup-zegarkow-warszawa', label: 'Викуп годинників' },
    skupRolex: { href: '/skup-rolex-warszawa', label: 'Викуп Rolex' },
    skupCentrum: { href: '/skup-zegarkow-centrum-warszawy', label: 'Викуп у центрі Варшави' },
    wycena: { href: '/wycena-zegarka-warszawa', label: 'Оцінка годинника' },
    komis: { href: '/komis-zegarkow-warszawa', label: 'Комісія годинників' },
    serwis: { href: '/uslugi/naprawa-i-serwis', label: 'Ремонт і сервіс' },
    auth: { href: '/jak-weryfikujemy-autentycznosc-zegarka', label: 'Як перевіряємо автентичність' },
    about: { href: '/o-nas', label: 'Про бутік' },
    boutique: { href: '/butik', label: 'Бутік Mokotowska 71' },
    contact: { href: '/kontakt', label: 'Контакт' },
  },
} as const

type Locale = keyof typeof L
type LinkKey = keyof typeof L['pl']

/**
 * Spójny zestaw linków per kategoria landingu. 7–8 linków każdy:
 * - 2–3 najbliższe pokrewne (sibling brand/sibling kategoria/sibling usługa)
 * - 1 katalog
 * - 1 główny hub (luxury)
 * - 1 link na proces weryfikacji (E-E-A-T)
 * - 1 link o butiku (E-E-A-T)
 */
const TEMPLATES: Record<LandingCategory, LinkKey[]> = {
  'brand-hub': ['catalogue', 'rolex', 'patek', 'ap', 'breitling', 'omega', 'cartier', 'auth', 'about'],
  'category-hub': ['catalogue', 'luxury', 'rolex', 'patek', 'chronos', 'gold', 'diamond', 'ladies', 'auth', 'about'],
  'service-hub': ['skup', 'skupRolex', 'skupCentrum', 'wycena', 'komis', 'serwis', 'rolex', 'auth', 'about'],
  'on-request': ['onRequest', 'rolexOR', 'patekOR', 'apOR', 'rolex', 'patek', 'ap', 'auth', 'about'],
  process: ['catalogue', 'luxury', 'rolex', 'patek', 'ap', 'serwis', 'wycena', 'about'],
  about: ['catalogue', 'luxury', 'rolex', 'patek', 'ap', 'boutique', 'auth', 'contact'],
}

/**
 * Zwraca listę 6 linków powiązanych dla danego slug-a i kategorii.
 *
 * - Wyklucza sam siebie (po href === `/${slug}`)
 * - Zawsze zachowuje linki do procesu autentyczności i strony „O nas”
 * - Pozostałe miejsca wypełnia najbardziej kontekstowymi linkami z szablonu
 * - W razie potrzeby caller może dorzucić dodatkowe linki kontekstowe
 *
 * @param slug — slug bieżącego landinga (bez `/`), np. `zegarki-rolex-warszawa`
 * @param category — typ landinga
 * @param locale — domyślnie `'pl'`
 */
export function relatedLinksFor(
  slug: string,
  category: LandingCategory,
  locale: Locale = 'pl',
): RelatedLink[] {
  const lib = L[locale]
  const keys = TEMPLATES[category]
  const selfHref = `/${slug}`
  const candidates = keys
    .map((key) => ({ key, link: lib[key] }))
    .filter(({ link }) => link.href !== selfHref)
  const required = candidates.filter(({ key }) => key === 'auth' || key === 'about')
  const contextual = candidates.filter(({ key }) => key !== 'auth' && key !== 'about')
  return [...contextual.slice(0, Math.max(0, 6 - required.length)), ...required].map(
    ({ link }) => ({ href: link.href, label: link.label }),
  )
}

/**
 * Zgrupowane linki nawigacyjne SEO do „hubu” pokazywanego globalnie (stopka)
 * i na stronie katalogu. Cel: każda strona-landing dostaje wewnętrzny link z
 * całego serwisu (koniec ze stronami-sierotami), a użytkownik ma czytelny
 * spis marek / kategorii / usług. Hrefy są kanoniczne (PL) — komponent
 * renderujący lokalizuje je przez `localizePath`.
 */
export type SeoHubGroup = { heading: string; links: RelatedLink[] }

const HUB_HEADINGS: Record<Locale, { brands: string; categories: string; services: string; expertise: string }> = {
  pl: { brands: 'Marki', categories: 'Kategorie', services: 'Skup i usługi', expertise: 'Eksperci i butik' },
  en: { brands: 'Brands', categories: 'Categories', services: 'Buying & services', expertise: 'Expertise & boutique' },
  ua: { brands: 'Бренди', categories: 'Категорії', services: 'Викуп і послуги', expertise: 'Експерти та бутік' },
}

const HUB_GROUPS: { key: keyof (typeof HUB_HEADINGS)['pl']; items: LinkKey[] }[] = [
  { key: 'brands', items: ['rolex', 'patek', 'ap', 'omega', 'cartier', 'breitling', 'rolexOR', 'patekOR', 'apOR'] },
  { key: 'categories', items: ['luxury', 'preowned', 'collector', 'chronos', 'gold', 'diamond', 'ladies'] },
  { key: 'services', items: ['skup', 'skupRolex', 'skupCentrum', 'wycena', 'komis', 'serwis', 'onRequest'] },
  { key: 'expertise', items: ['auth', 'about', 'boutique', 'contact'] },
]

export function seoHubLinks(locale: Locale = 'pl'): SeoHubGroup[] {
  const lib = L[locale]
  const headings = HUB_HEADINGS[locale]
  return HUB_GROUPS.map((group) => ({
    heading: headings[group.key],
    links: group.items.map((key) => ({ href: lib[key].href, label: lib[key].label })),
  }))
}
