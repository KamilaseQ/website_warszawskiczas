import type { Product } from '@/from-cms/schemas/product'
import { type Locale, ui } from '@/lib/i18n'
import { productPublicPrice, productShowsPriceOnRequest } from '@/lib/product-availability'

const intlLocale = (locale: Locale) => (locale === 'ua' ? 'uk-UA' : locale === 'en' ? 'en-US' : 'pl-PL')

export function formatProductPrice(product: Product, locale: Locale) {
  const publicPrice = productPublicPrice(product)
  if (publicPrice) {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(publicPrice)
  }
  if (productShowsPriceOnRequest(product)) return ui[locale].priceOnRequest
  return null
}

/**
 * Słownik tłumaczeń pól produktu z PL na EN/UA.
 *
 * Krytyczne dla katalogu i karty produktu — opisy `material` i `condition`
 * w fixtures są po polsku, a w EN/UA muszą wyglądać natywnie.
 *
 * UWAGA na kolejność reguł: wzorce wielowyrazowe MUSZĄ być przed jednowyrazowymi
 * (np. `Stal nierdzewna` przed `Stal`, `Bardzo dobry` przed `Dobry`), inaczej
 * dłuższe frazy nie pasują — `Stal nierdzewna` zamieniłoby się na `steel nierdzewna`.
 */
function replaceCommon(text: string, locale: Locale) {
  if (locale === 'pl') return text

  const en: [RegExp, string][] = [
    // Materiały — frazy wielowyrazowe NAJPIERW
    [/Stal nierdzewna/gi, 'stainless steel'],
    [/Stal Oystersteel/gi, 'Oystersteel'],
    [/Biały metal szlachetny/gi, 'white precious metal'],
    [/biały metal/gi, 'white precious metal'],
    [/różowe złoto/gi, 'rose gold'],
    [/białe złoto/gi, 'white gold'],
    [/żółte złoto/gi, 'yellow gold'],
    [/żółtego złota/gi, 'yellow gold'],
    [/różowego złota/gi, 'rose gold'],
    [/białego złota/gi, 'white gold'],
    [/18-karatowe(?:go)?/gi, '18-carat'],
    [/karatowe/gi, '-carat'],
    [/(\d+)\s*K\b/g, '$1K'],
    [/złoto/gi, 'gold'],
    [/złota/gi, 'gold'],
    [/\bStal\b/g, 'steel'],
    [/\bstal\b/g, 'steel'],
    [/stalow(?:y|a|ą|e|ej|ym|ego)/gi, 'steel'],
    [/platyna/gi, 'platinum'],
    [/tytan/gi, 'titanium'],
    [/ceramika high-tech/gi, 'high-tech ceramic'],
    [/ceramiczny/gi, 'ceramic'],
    [/ceramika/gi, 'ceramic'],
    [/masa perłowa/gi, 'mother-of-pearl'],
    [/perłowa/gi, 'pearl'],
    // Diamenty
    [/Fabryczne diamenty/gi, 'factory-set diamonds'],
    [/diamenty fabryczne/gi, 'factory-set diamonds'],
    [/diamentowy bezel/gi, 'diamond bezel'],
    [/diamentowe indeksy/gi, 'diamond indices'],
    [/indeksy diamentowe/gi, 'diamond indices'],
    [/diamenty/gi, 'diamonds'],
    [/diament/gi, 'diamond'],
    [/diamentowe/gi, 'diamond'],
    [/brylantowe/gi, 'diamond'],
    // Paski i bransolety
    [/pasek aligatorowy/gi, 'alligator strap'],
    [/pasek skórzany/gi, 'leather strap'],
    [/pasek gumowy/gi, 'rubber strap'],
    [/pasek tekstylny/gi, 'textile strap'],
    [/pasek gumowo-skórzany/gi, 'rubber-leather strap'],
    [/bransoleta President/gi, 'President bracelet'],
    [/bransoleta Jubilee/gi, 'Jubilee bracelet'],
    [/bransoleta Oyster/gi, 'Oyster bracelet'],
    [/bransoleta Overseas/gi, 'Overseas bracelet'],
    [/bransoleta dwukolorowa/gi, 'two-tone bracelet'],
    [/bransoleta stalowa/gi, 'steel bracelet'],
    [/bransoleta stalowo-gumowa/gi, 'steel-rubber bracelet'],
    [/zintegrowana bransoleta/gi, 'integrated bracelet'],
    [/bransoleta/gi, 'bracelet'],
    // Komponenty zegarka
    [/tarcza/gi, 'dial'],
    [/koperta tonneau/gi, 'tonneau case'],
    [/koperta Long Island/gi, 'Long Island case'],
    [/koperta/gi, 'case'],
    [/bezel/gi, 'bezel'],
    [/cyframi rzymskimi/gi, 'roman numerals'],
    [/cyfry rzymskie/gi, 'roman numerals'],
    // Komplikacje i mechanizm
    [/kalendarz wieczny/gi, 'perpetual calendar'],
    [/kalendarz roczny/gi, 'annual calendar'],
    [/szkieletowany mechanizm/gi, 'skeleton movement'],
    [/automatyczny/gi, 'automatic'],
    [/chronograf/gi, 'chronograph'],
    // Stan
    [/Bardzo dobry/gi, 'Very good'],
    [/bardzo dobry/g, 'very good'],
    [/\bDobry\b/g, 'Good'],
    [/\bdobry\b/g, 'good'],
    [/\bUżywany\b/g, 'Pre-owned'],
    [/\bużywany\b/g, 'pre-owned'],
    [/\bNowy\b/g, 'New'],
    [/\bnowy\b/g, 'new'],
    [/drobne ślady użytkowania/gi, 'minor signs of wear'],
    [/widoczne ślady użytkowania/gi, 'visible signs of wear'],
    [/normalne ślady użytkowania/gi, 'normal signs of wear'],
    [/ślady użytkowania/gi, 'signs of wear'],
    [/z folią ochronną/gi, 'with protective film'],
    [/widoczną na deklu/gi, 'visible on the case back'],
    // Edycje
    [/edycja limitowana/gi, 'limited edition'],
    [/limitowana edycja/gi, 'limited edition'],
    [/limitowana seria/gi, 'limited series'],
    // Kolory
    [/niebiesk(?:i|a|ą|ie|iej|im|iego)/gi, 'blue'],
    [/czarn(?:y|a|ą|e|ej|ym|ego)/gi, 'black'],
    [/biał(?:y|a|ą|e|ej|ym|ego)/gi, 'white'],
    [/zielon(?:y|a|ą|e|ej|ym|ego)/gi, 'green'],
    [/srebrn(?:y|a|ą|e|ej|ym|ego)/gi, 'silver'],
    [/szar(?:y|a|ą|e|ej|ym|ego)/gi, 'grey'],
    [/brązow(?:y|a|ą|e|ej|ym|ego)/gi, 'brown'],
    // Słowa funkcjonalne
    [/zintegrowana/gi, 'integrated'],
    [/zegarek/gi, 'watch'],
    [/zegarki/gi, 'watches'],
    [/dwukolorowa/gi, 'two-tone'],
    [/lub/gi, 'or'],
    [/i\s/gi, 'and '],
    [/\bz\s/g, 'with '],
  ]

  const ua: [RegExp, string][] = [
    // Materiały
    [/Stal nierdzewna/gi, 'нержавіюча сталь'],
    [/Stal Oystersteel/gi, 'сталь Oystersteel'],
    [/Biały metal szlachetny/gi, 'білий дорогоцінний метал'],
    [/biały metal/gi, 'білий дорогоцінний метал'],
    [/różowe złoto/gi, 'рожеве золото'],
    [/białe złoto/gi, 'біле золото'],
    [/żółte złoto/gi, 'жовте золото'],
    [/żółtego złota/gi, 'жовтого золота'],
    [/różowego złota/gi, 'рожевого золота'],
    [/białego złota/gi, 'білого золота'],
    [/18-karatowe(?:go)?/gi, '18-каратне'],
    [/karatowe/gi, '-каратне'],
    [/(\d+)\s*K\b/g, '$1K'],
    [/złoto/gi, 'золото'],
    [/złota/gi, 'золота'],
    [/\bStal\b/g, 'Сталь'],
    [/\bstal\b/g, 'сталь'],
    [/stalow(?:y|a|ą|e|ej|ym|ego)/gi, 'сталевий'],
    [/platyna/gi, 'платина'],
    [/tytan/gi, 'титан'],
    [/ceramika high-tech/gi, 'високотехнологічна кераміка'],
    [/ceramiczny/gi, 'керамічний'],
    [/ceramika/gi, 'кераміка'],
    [/masa perłowa/gi, 'перламутр'],
    [/perłowa/gi, 'перлинна'],
    // Diamenty
    [/Fabryczne diamenty/gi, 'фабричні діаманти'],
    [/diamenty fabryczne/gi, 'фабричні діаманти'],
    [/diamentowy bezel/gi, 'діамантовий безель'],
    [/diamentowe indeksy/gi, 'діамантові індекси'],
    [/indeksy diamentowe/gi, 'діамантові індекси'],
    [/diamenty/gi, 'діаманти'],
    [/diament/gi, 'діамант'],
    [/diamentowe/gi, 'діамантові'],
    [/brylantowe/gi, 'діамантові'],
    // Paski i bransolety
    [/pasek aligatorowy/gi, 'алігаторовий ремінець'],
    [/pasek skórzany/gi, 'шкіряний ремінець'],
    [/pasek gumowy/gi, 'гумовий ремінець'],
    [/pasek tekstylny/gi, 'текстильний ремінець'],
    [/pasek gumowo-skórzany/gi, 'гумово-шкіряний ремінець'],
    [/bransoleta President/gi, 'браслет President'],
    [/bransoleta Jubilee/gi, 'браслет Jubilee'],
    [/bransoleta Oyster/gi, 'браслет Oyster'],
    [/bransoleta Overseas/gi, 'браслет Overseas'],
    [/bransoleta dwukolorowa/gi, 'двоколірний браслет'],
    [/bransoleta stalowa/gi, 'сталевий браслет'],
    [/bransoleta stalowo-gumowa/gi, 'сталево-гумовий браслет'],
    [/zintegrowana bransoleta/gi, 'інтегрований браслет'],
    [/bransoleta/gi, 'браслет'],
    // Komponenty zegarka
    [/tarcza/gi, 'циферблат'],
    [/koperta tonneau/gi, 'корпус tonneau'],
    [/koperta Long Island/gi, 'корпус Long Island'],
    [/koperta/gi, 'корпус'],
    [/bezel/gi, 'безель'],
    [/cyframi rzymskimi/gi, 'римськими цифрами'],
    [/cyfry rzymskie/gi, 'римські цифри'],
    // Komplikacje
    [/kalendarz wieczny/gi, 'вічний календар'],
    [/kalendarz roczny/gi, 'річний календар'],
    [/szkieletowany mechanizm/gi, 'скелетонний механізм'],
    [/automatyczny/gi, 'автоматичний'],
    [/chronograf/gi, 'хронограф'],
    // Stan
    [/Bardzo dobry/gi, 'Дуже добрий'],
    [/bardzo dobry/g, 'дуже добрий'],
    [/\bDobry\b/g, 'Добрий'],
    [/\bdobry\b/g, 'добрий'],
    [/\bUżywany\b/g, 'Вживаний'],
    [/\bużywany\b/g, 'вживаний'],
    [/\bNowy\b/g, 'Новий'],
    [/\bnowy\b/g, 'новий'],
    [/drobne ślady użytkowania/gi, 'незначні сліди використання'],
    [/widoczne ślady użytkowania/gi, 'помітні сліди використання'],
    [/normalne ślady użytkowania/gi, 'звичайні сліди використання'],
    [/ślady użytkowania/gi, 'сліди використання'],
    [/z folią ochronną/gi, 'із захисною плівкою'],
    [/widoczną na deklu/gi, 'на задній кришці'],
    // Edycje
    [/edycja limitowana/gi, 'лімітована серія'],
    [/limitowana edycja/gi, 'лімітована серія'],
    [/limitowana seria/gi, 'лімітована серія'],
    // Kolory
    [/niebiesk(?:i|a|ą|ie|iej|im|iego)/gi, 'синій'],
    [/czarn(?:y|a|ą|e|ej|ym|ego)/gi, 'чорний'],
    [/biał(?:y|a|ą|e|ej|ym|ego)/gi, 'білий'],
    [/zielon(?:y|a|ą|e|ej|ym|ego)/gi, 'зелений'],
    [/srebrn(?:y|a|ą|e|ej|ym|ego)/gi, 'срібний'],
    [/szar(?:y|a|ą|e|ej|ym|ego)/gi, 'сірий'],
    [/brązow(?:y|a|ą|e|ej|ym|ego)/gi, 'коричневий'],
    // Funkcjonalne
    [/zintegrowana/gi, 'інтегрований'],
    [/zegarek/gi, 'годинник'],
    [/zegarki/gi, 'годинники'],
    [/dwukolorowa/gi, 'двоколірна'],
    [/\blub\b/gi, 'або'],
    [/\bi\s/g, 'та '],
    [/\bz\s/g, 'із '],
  ]

  return (locale === 'en' ? en : ua).reduce((out, [from, to]) => out.replace(from, to), text)
}

/**
 * Tłumaczenie statusu produktu (`Dostępny` / `Na zamówienie` / `Niedostępny`).
 * `Na zamówienie` jest stanem operacyjnym, a `Niedostępny` oznacza brak sztuki.
 */
export function localizeProductStatus(
  status: Product['status'],
  locale: Locale,
): string | undefined {
  if (!status) return undefined
  if (locale === 'pl') return status
  const t = ui[locale]
  if (status === 'Dostępny') return t.available
  if (status === 'Na zamówienie') return t.unavailableSourcing
  if (status === 'Niedostępny') return t.unavailable
  return status
}

export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === 'pl') return product

  const material = product.material ? replaceCommon(product.material, locale) : undefined
  const condition = product.condition ? replaceCommon(product.condition, locale) : undefined
  const reference = product.reference ? ` ref. ${product.reference}` : ''
  const year = product.year ? `, ${product.year}` : ''

  if (locale === 'en') {
    return {
      ...product,
      material,
      condition,
      description: `${product.brand} ${product.name}${reference} is a premium watch available through Warszawski Czas in Warsaw. ${material ? `Configuration: ${material}. ` : ''}${condition ? `Condition: ${condition}. ` : ''}The piece can be viewed in our boutique at Mokotowska 71 or discussed remotely with a private consultant.`,
      editorial: `A carefully selected ${product.brand} piece for collectors looking for luxury watches in Warsaw. We verify authenticity, documentation and condition before presenting each watch in the catalogue.`,
      story: `${product.brand} ${product.name}${year} is presented as part of the Warszawski Czas curated collection. We focus on provenance, mechanical condition and discreet service for clients buying exclusive watches in Warsaw.`,
    }
  }

  return {
    ...product,
    material,
    condition,
    description: `${product.brand} ${product.name}${reference} — преміальний годинник, доступний у Warszawski Czas у Варшаві. ${material ? `Конфігурація: ${material}. ` : ''}${condition ? `Стан: ${condition}. ` : ''}Екземпляр можна переглянути в бутіку на Mokotowska 71 або обговорити дистанційно з приватним консультантом.`,
    editorial: `Ретельно відібраний екземпляр ${product.brand} для клієнтів, які шукають люксові годинники у Варшаві. Перед презентацією ми перевіряємо автентичність, документи та стан.`,
    story: `${product.brand} ${product.name}${year} входить до кураторської колекції Warszawski Czas. Ми зосереджуємося на походженні, механічному стані та дискретному сервісі для клієнтів, які купують ексклюзивні годинники у Варшаві.`,
  }
}
