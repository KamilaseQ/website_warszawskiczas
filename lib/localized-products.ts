import { type Product } from '@/data/mock-products'
import { type Locale, ui } from '@/lib/i18n'

const intlLocale = (locale: Locale) => (locale === 'ua' ? 'uk-UA' : locale === 'en' ? 'en-US' : 'pl-PL')

export function formatProductPrice(product: Product, locale: Locale) {
  if (product.price) {
    return new Intl.NumberFormat(intlLocale(locale), {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(product.price)
  }
  if (product.priceOnRequest) return ui[locale].priceOnRequest
  return null
}

function replaceCommon(text: string, locale: Locale) {
  if (locale === 'pl') return text

  const en: [RegExp, string][] = [
    [/Stal nierdzewna/gi, 'stainless steel'],
    [/stal nierdzewna/gi, 'stainless steel'],
    [/złoto/gi, 'gold'],
    [/różowe złoto/gi, 'rose gold'],
    [/białe złoto/gi, 'white gold'],
    [/żółte złoto/gi, 'yellow gold'],
    [/biały metal/gi, 'white precious metal'],
    [/diamenty/gi, 'diamonds'],
    [/diamentowe/gi, 'diamond'],
    [/masa perłowa/gi, 'mother-of-pearl'],
    [/pasek skórzany/gi, 'leather strap'],
    [/bransoleta/gi, 'bracelet'],
    [/tarcza/gi, 'dial'],
    [/koperta/gi, 'case'],
    [/bardzo dobry/gi, 'very good'],
    [/dobry/gi, 'good'],
    [/drobne ślady użytkowania/gi, 'minor signs of wear'],
    [/widoczne ślady użytkowania/gi, 'visible signs of wear'],
    [/niebiesk[iaą]/gi, 'blue'],
    [/czarn[ayą]/gi, 'black'],
    [/biał[ayą]/gi, 'white'],
    [/zielon[ayą]/gi, 'green'],
    [/zintegrowana/gi, 'integrated'],
    [/automatyczny/gi, 'automatic'],
    [/chronograf/gi, 'chronograph'],
    [/zegarek/gi, 'watch'],
    [/zegarki/gi, 'watches'],
  ]

  const ua: [RegExp, string][] = [
    [/Stal nierdzewna/gi, 'нержавіюча сталь'],
    [/stal nierdzewna/gi, 'нержавіюча сталь'],
    [/złoto/gi, 'золото'],
    [/różowe złoto/gi, 'рожеве золото'],
    [/białe złoto/gi, 'біле золото'],
    [/żółte złoto/gi, 'жовте золото'],
    [/biały metal/gi, 'білий дорогоцінний метал'],
    [/diamenty/gi, 'діаманти'],
    [/diamentowe/gi, 'діамантові'],
    [/masa perłowa/gi, 'перламутр'],
    [/pasek skórzany/gi, 'шкіряний ремінець'],
    [/bransoleta/gi, 'браслет'],
    [/tarcza/gi, 'циферблат'],
    [/koperta/gi, 'корпус'],
    [/bardzo dobry/gi, 'дуже добрий'],
    [/dobry/gi, 'добрий'],
    [/drobne ślady użytkowania/gi, 'незначні сліди використання'],
    [/widoczne ślady użytkowania/gi, 'помітні сліди використання'],
    [/niebiesk[iaą]/gi, 'синій'],
    [/czarn[ayą]/gi, 'чорний'],
    [/biał[ayą]/gi, 'білий'],
    [/zielon[ayą]/gi, 'зелений'],
    [/zintegrowana/gi, 'інтегрований'],
    [/automatyczny/gi, 'автоматичний'],
    [/chronograf/gi, 'хронограф'],
    [/zegarek/gi, 'годинник'],
    [/zegarki/gi, 'годинники'],
  ]

  return (locale === 'en' ? en : ua).reduce((out, [from, to]) => out.replace(from, to), text)
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
