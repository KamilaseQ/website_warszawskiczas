import type { Metadata } from 'next'

export const locales = ['pl', 'en', 'ua'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pl'
export const baseUrl = 'https://warszawskiczas.pl'

export const localeConfig: Record<
  Locale,
  {
    label: string
    prefix: string
    htmlLang: string
    hreflang: string
    ogLocale: string
    name: string
  }
> = {
  pl: {
    label: 'PL',
    prefix: '',
    htmlLang: 'pl',
    hreflang: 'pl',
    ogLocale: 'pl_PL',
    name: 'Polski',
  },
  en: {
    label: 'EN',
    prefix: '/en',
    htmlLang: 'en',
    hreflang: 'en',
    ogLocale: 'en_US',
    name: 'English',
  },
  ua: {
    label: 'UA',
    prefix: '/ua',
    htmlLang: 'uk-UA',
    hreflang: 'uk-UA',
    ogLocale: 'uk_UA',
    name: 'Українська',
  },
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && locales.includes(value as Locale)
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  const first = pathname?.split('/').filter(Boolean)[0]
  return isLocale(first) ? first : defaultLocale
}

type NonPlLocale = Exclude<Locale, 'pl'>

// Per-segment slug translations. Keys are canonical (PL) segments; values are translated segments.
// Brand-model product slugs are NOT in this map and stay verbatim across locales.
const SEGMENT_TRANSLATIONS: Record<NonPlLocale, Record<string, string>> = {
  en: {
    produkty: 'products',
    butik: 'boutique',
    uslugi: 'services',
    skup: 'watch-buying',
    komis: 'consignment',
    'naprawa-i-serwis': 'repair-and-service',
    kontakt: 'contact',
    dziekujemy: 'thank-you',
    'kolekcja-na-zapytanie': 'private-collection',
    'polityka-prywatnosci': 'privacy-policy',
    regulamin: 'terms',
    'deklaracja-dostepnosci': 'accessibility-statement',
    'skup-zegarkow-warszawa': 'sell-luxury-watches-warsaw',
    'skup-rolex-warszawa': 'sell-rolex-warsaw',
    'wycena-zegarka-warszawa': 'watch-valuation-warsaw',
    'komis-zegarkow-warszawa': 'watch-consignment-warsaw',
    'skup-zegarkow-centrum-warszawy': 'watch-buying-central-warsaw',
    'zegarki-luksusowe-warszawa': 'luxury-watches-warsaw',
    'zegarki-uzywane-warszawa': 'pre-owned-watches-warsaw',
    'zegarki-rolex-warszawa': 'rolex-watches-warsaw',
    'zegarki-omega-warszawa': 'omega-watches-warsaw',
    'zegarki-cartier-warszawa': 'cartier-watches-warsaw',
    'zegarki-damskie-warszawa': 'ladies-watches-warsaw',
    'zegarki-ze-zlota-warszawa': 'gold-watches-warsaw',
    'zegarki-z-diamentami-warszawa': 'diamond-watches-warsaw',
    'chronografy-warszawa': 'chronographs-warsaw',
    'zegarki-na-zamowienie': 'watches-on-request',
    'rolex-na-zamowienie': 'rolex-on-request',
    'patek-philippe-na-zamowienie': 'patek-philippe-on-request',
    'audemars-piguet-na-zamowienie': 'audemars-piguet-on-request',
    'zegarki-kolekcjonerskie': 'collector-watches',
  },
  ua: {
    produkty: 'каталог',
    butik: 'бутік',
    uslugi: 'послуги',
    skup: 'викуп',
    komis: 'комісія',
    'naprawa-i-serwis': 'ремонт-і-сервіс',
    kontakt: 'контакт',
    dziekujemy: 'дякуємо',
    'kolekcja-na-zapytanie': 'приватна-колекція',
    'polityka-prywatnosci': 'політика-конфіденційності',
    regulamin: 'правила',
    'deklaracja-dostepnosci': 'декларація-доступності',
    'skup-zegarkow-warszawa': 'викуп-годинників-варшава',
    'skup-rolex-warszawa': 'викуп-rolex-варшава',
    'wycena-zegarka-warszawa': 'оцінка-годинника-варшава',
    'komis-zegarkow-warszawa': 'комісія-годинників-варшава',
    'skup-zegarkow-centrum-warszawy': 'викуп-годинників-центр-варшави',
    'zegarki-luksusowe-warszawa': 'люксові-годинники-варшава',
    'zegarki-uzywane-warszawa': 'вживані-годинники-варшава',
    'zegarki-rolex-warszawa': 'годинники-rolex-варшава',
    'zegarki-omega-warszawa': 'годинники-omega-варшава',
    'zegarki-cartier-warszawa': 'годинники-cartier-варшава',
    'zegarki-damskie-warszawa': 'жіночі-годинники-варшава',
    'zegarki-ze-zlota-warszawa': 'золоті-годинники-варшава',
    'zegarki-z-diamentami-warszawa': 'годинники-з-діамантами-варшава',
    'chronografy-warszawa': 'хронографи-варшава',
    'zegarki-na-zamowienie': 'годинники-на-замовлення',
    'rolex-na-zamowienie': 'rolex-на-замовлення',
    'patek-philippe-na-zamowienie': 'patek-philippe-на-замовлення',
    'audemars-piguet-na-zamowienie': 'audemars-piguet-на-замовлення',
    'zegarki-kolekcjonerskie': 'колекційні-годинники',
  },
}

const REVERSE_SEGMENT_TRANSLATIONS: Record<NonPlLocale, Record<string, string>> = {
  en: Object.fromEntries(Object.entries(SEGMENT_TRANSLATIONS.en).map(([pl, t]) => [t, pl])),
  ua: Object.fromEntries(Object.entries(SEGMENT_TRANSLATIONS.ua).map(([pl, t]) => [t, pl])),
}

function safeDecodeSegment(seg: string): string {
  try {
    return decodeURIComponent(seg)
  } catch {
    return seg
  }
}

export function stripLocale(pathname: string | null | undefined): string {
  if (!pathname) return '/'
  const clean = pathname.split('?')[0]?.split('#')[0] || '/'
  const parts = clean.split('/').filter(Boolean)
  if (isLocale(parts[0])) parts.shift()
  return `/${parts.join('/')}`.replace(/\/$/, '') || '/'
}

/** Translate a canonical (PL) path into a localized path including locale prefix. */
export function localizePath(path: string, locale: Locale): string {
  const clean = stripLocale(path)
  if (locale === 'pl') return clean
  const segs = clean
    .split('/')
    .filter(Boolean)
    .map((s) => {
      const decoded = safeDecodeSegment(s)
      return SEGMENT_TRANSLATIONS[locale][decoded] ?? decoded
    })
  const prefix = localeConfig[locale].prefix
  return segs.length ? `${prefix}/${segs.join('/')}` : prefix
}

/** Reverse a localized path (for `locale`) back to the canonical (PL) path. */
export function canonicalPath(path: string, locale: Locale): string {
  const clean = stripLocale(path)
  const segs = clean
    .split('/')
    .filter(Boolean)
    .map((s) => {
      const decoded = safeDecodeSegment(s)
      if (locale === 'pl') return decoded
      return REVERSE_SEGMENT_TRANSLATIONS[locale][decoded] ?? decoded
    })
  return segs.length ? `/${segs.join('/')}` : '/'
}

export function switchLocalePath(pathname: string | null | undefined, locale: Locale): string {
  const current = localeFromPathname(pathname)
  const canonical = canonicalPath(pathname ?? '/', current)
  return localizePath(canonical, locale)
}

function encodePathname(path: string): string {
  if (!path || path === '/') return path
  return path
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(seg) : seg))
    .join('/')
}

export function absoluteUrl(path: string, locale?: Locale): string {
  const localized = locale ? localizePath(path, locale) : path
  const encoded = encodePathname(localized)
  return `${baseUrl}${encoded === '/' ? '' : encoded}`
}

/** Build hreflang alternates. `path` may be canonical (PL) or localized (when so, pass `fromLocale`). */
export function alternateLanguages(path: string, fromLocale: Locale = 'pl'): NonNullable<Metadata['alternates']>['languages'] {
  const canonical = canonicalPath(path, fromLocale)
  return {
    pl: absoluteUrl(canonical, 'pl'),
    en: absoluteUrl(canonical, 'en'),
    'uk-UA': absoluteUrl(canonical, 'ua'),
    'x-default': absoluteUrl(canonical, 'pl'),
  }
}

export function localizedAlternates(path: string, locale: Locale): Metadata['alternates'] {
  const canonical = canonicalPath(path, locale)
  return {
    canonical: absoluteUrl(canonical, locale),
    languages: alternateLanguages(canonical, 'pl'),
  }
}

export const publicRoutePaths = [
  '/',
  '/produkty',
  '/butik',
  '/uslugi',
  '/uslugi/skup',
  '/uslugi/komis',
  '/uslugi/naprawa-i-serwis',
  '/kontakt',
  '/kontakt/dziekujemy',
  '/kolekcja-na-zapytanie',
  '/polityka-prywatnosci',
  '/regulamin',
  '/deklaracja-dostepnosci',
  '/skup-zegarkow-warszawa',
  '/skup-rolex-warszawa',
  '/wycena-zegarka-warszawa',
  '/komis-zegarkow-warszawa',
  '/skup-zegarkow-centrum-warszawy',
  '/zegarki-luksusowe-warszawa',
  '/zegarki-uzywane-warszawa',
  '/zegarki-rolex-warszawa',
  '/zegarki-omega-warszawa',
  '/zegarki-cartier-warszawa',
  '/zegarki-damskie-warszawa',
  '/zegarki-ze-zlota-warszawa',
  '/zegarki-z-diamentami-warszawa',
  '/chronografy-warszawa',
  '/zegarki-na-zamowienie',
  '/rolex-na-zamowienie',
  '/patek-philippe-na-zamowienie',
  '/audemars-piguet-na-zamowienie',
  '/zegarki-kolekcjonerskie',
] as const

export const ui = {
  pl: {
    consult: 'Umów konsultację',
    home: 'Strona główna',
    products: 'Produkty',
    hiddenCollection: 'Ukryta Kolekcja',
    services: 'Usługi',
    repair: 'Naprawa i serwis',
    buying: 'Skup',
    buyingWatches: 'Skup zegarków',
    consignment: 'Komis',
    boutique: 'Butik',
    contact: 'Kontakt',
    menu: 'Menu',
    closeMenu: 'Zamknij menu',
    openMenu: 'Otwórz menu',
    offer: 'Oferta',
    info: 'Informacje',
    aboutBoutique: 'O butiku',
    privacy: 'Polityka prywatności',
    terms: 'Regulamin',
    accessibility: 'Deklaracja dostępności',
    footerTagline: 'Zegarki z historią.\nEksperci z pasją.',
    footerDescription:
      'Butik zegarków premium w sercu Warszawy. Mechaniczna precyzja, wiedza i dyskrecja od 2019 roku.',
    hours: 'Pon - Pt: 11:00 - 18:00\nSob: 11:00 - 15:00\nNd: Zamknięte',
    weekdays: '11:00 - 18:00',
    jewelry: 'Biżuteria',
    all: 'Wszystkie',
    available: 'Dostępny',
    reserved: 'Zarezerwowany',
    unavailable: 'Niedostępny',
    featured: 'Polecane',
    priceAsc: 'Cena rosnąco',
    priceDesc: 'Cena malejąco',
    brandAsc: 'Marka A-Z',
    filters: 'Filtry',
    sort: 'Sortuj',
    active: 'Aktywne:',
    clearAll: 'Wyczyść wszystkie',
    priceOnRequest: 'Cena na zapytanie',
    itemSingular: 'pozycja',
    itemFew: 'pozycje',
    itemMany: 'pozycji',
    selectedPieces: 'Wybrane egzemplarze',
    viewFullCatalog: 'Zobacz cały katalog',
    faqHeading: 'Najczęstsze pytania',
    contactUs: 'Skontaktuj się',
    whatsappIntro: 'Dzień dobry, piszę w sprawie',
    relatedCatalog: 'Cały katalog',
    new: 'Nowość',
    onRequest: 'Na zapytanie',
    noMatchingItems: 'Brak pozycji spełniających wybrane filtry.',
    clearFilters: 'Wyczyść filtry',
    closeFilters: 'Zamknij filtry',
    brand: 'Marka',
    availability: 'Dostępność',
    price: 'Cena',
    priceMin: 'Cena minimalna',
    priceMax: 'Cena maksymalna',
    onRequestNotFiltered: 'Pozycje "Cena na zapytanie" nie są filtrowane wg ceny.',
    featuredFilter: 'Wyróżnienia',
    clear: 'Wyczyść',
    removeFilter: 'Usuń filtr',
  },
  en: {
    consult: 'Book a consultation',
    home: 'Home',
    products: 'Products',
    hiddenCollection: 'Hidden Collection',
    services: 'Services',
    repair: 'Repair and service',
    buying: 'Buying',
    buyingWatches: 'Watch buying',
    consignment: 'Consignment',
    boutique: 'Boutique',
    contact: 'Contact',
    menu: 'Menu',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
    offer: 'Offer',
    info: 'Information',
    aboutBoutique: 'About the boutique',
    privacy: 'Privacy policy',
    terms: 'Terms',
    accessibility: 'Accessibility statement',
    footerTagline: 'Watches with history.\nExperts with passion.',
    footerDescription:
      'A premium watch boutique in the heart of Warsaw. Mechanical precision, expertise and discretion since 2019.',
    hours: 'Mon - Fri: 11:00 - 18:00\nSat: 11:00 - 15:00\nSun: Closed',
    weekdays: '11:00 - 18:00',
    jewelry: 'Jewellery',
    all: 'All',
    available: 'Available',
    reserved: 'Reserved',
    unavailable: 'Unavailable',
    featured: 'Featured',
    priceAsc: 'Price ascending',
    priceDesc: 'Price descending',
    brandAsc: 'Brand A-Z',
    filters: 'Filters',
    sort: 'Sort',
    active: 'Active:',
    clearAll: 'Clear all',
    priceOnRequest: 'Price on request',
    itemSingular: 'item',
    itemFew: 'items',
    itemMany: 'items',
    selectedPieces: 'Selected pieces',
    viewFullCatalog: 'View the full catalogue',
    faqHeading: 'Frequently asked questions',
    contactUs: 'Contact us',
    whatsappIntro: 'Hello, I am writing about',
    relatedCatalog: 'Full catalogue',
    new: 'New',
    onRequest: 'On request',
    noMatchingItems: 'No items match the selected filters.',
    clearFilters: 'Clear filters',
    closeFilters: 'Close filters',
    brand: 'Brand',
    availability: 'Availability',
    price: 'Price',
    priceMin: 'Minimum price',
    priceMax: 'Maximum price',
    onRequestNotFiltered: 'Items marked "Price on request" are not filtered by price.',
    featuredFilter: 'Highlights',
    clear: 'Clear',
    removeFilter: 'Remove filter',
  },
  ua: {
    consult: 'Записатися на консультацію',
    home: 'Головна',
    products: 'Каталог',
    hiddenCollection: 'Прихована колекція',
    services: 'Послуги',
    repair: 'Ремонт і сервіс',
    buying: 'Викуп',
    buyingWatches: 'Викуп годинників',
    consignment: 'Комісія',
    boutique: 'Бутік',
    contact: 'Контакт',
    menu: 'Меню',
    closeMenu: 'Закрити меню',
    openMenu: 'Відкрити меню',
    offer: 'Пропозиція',
    info: 'Інформація',
    aboutBoutique: 'Про бутік',
    privacy: 'Політика конфіденційності',
    terms: 'Правила',
    accessibility: 'Декларація доступності',
    footerTagline: 'Годинники з історією.\nЕксперти з пристрастю.',
    footerDescription:
      'Бутік преміальних годинників у центрі Варшави. Механічна точність, знання та дискретність з 2019 року.',
    hours: 'Пн - Пт: 11:00 - 18:00\nСб: 11:00 - 15:00\nНд: зачинено',
    weekdays: '11:00 - 18:00',
    jewelry: 'Ювелірні вироби',
    all: 'Усі',
    available: 'Доступний',
    reserved: 'Зарезервований',
    unavailable: 'Недоступний',
    featured: 'Рекомендовані',
    priceAsc: 'Ціна за зростанням',
    priceDesc: 'Ціна за спаданням',
    brandAsc: 'Бренд A-Z',
    filters: 'Фільтри',
    sort: 'Сортувати',
    active: 'Активні:',
    clearAll: 'Очистити все',
    priceOnRequest: 'Ціна за запитом',
    itemSingular: 'позиція',
    itemFew: 'позиції',
    itemMany: 'позицій',
    selectedPieces: 'Вибрані екземпляри',
    viewFullCatalog: 'Переглянути весь каталог',
    faqHeading: 'Поширені запитання',
    contactUs: 'Зв’язатися',
    whatsappIntro: 'Добрий день, пишу щодо',
    relatedCatalog: 'Весь каталог',
    new: 'Нове',
    onRequest: 'За запитом',
    noMatchingItems: 'Немає позицій, що відповідають вибраним фільтрам.',
    clearFilters: 'Очистити фільтри',
    closeFilters: 'Закрити фільтри',
    brand: 'Бренд',
    availability: 'Наявність',
    price: 'Ціна',
    priceMin: 'Мінімальна ціна',
    priceMax: 'Максимальна ціна',
    onRequestNotFiltered: 'Позиції з позначкою "Ціна за запитом" не фільтруються за ціною.',
    featuredFilter: 'Виділені',
    clear: 'Очистити',
    removeFilter: 'Видалити фільтр',
  },
} satisfies Record<Locale, Record<string, string>>
