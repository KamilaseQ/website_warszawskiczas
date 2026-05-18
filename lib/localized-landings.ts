import type { SeoLandingProps } from '@/components/seo/seo-landing'
import {
  chronographWatches,
  diamondWatches,
  goldWatches,
  ladiesWatches,
  productsByBrand,
  sportWatches,
  vintageWatches,
} from '@/lib/seo-product-filters'
import type { Locale } from '@/lib/i18n'
import { getAllProducts } from '@/from-cms/adapters/products'
import type { Product } from '@/from-cms/schemas/product'

type LandingCopy = SeoLandingProps & {
  slug: string
  title: string
  description: string
  serviceName: string
  serviceType: string
  areaServed?: string
}

const brandList = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Cartier',
  'IWC',
  'Jaeger-LeCoultre',
  'Vacheron Constantin',
  'Breitling',
  'Panerai',
  'TAG Heuer',
  'Tudor',
]

/**
 * Spójna pula linków powiązanych dla EN/UA landingów. 6 linków: katalog,
 * główne huby marek, główny hub kategorii luksusowej, proces weryfikacji,
 * o butiku + kontakt. Każdy landing dostaje te linki domyślnie; specyficzne
 * brand-hub-y (Rolex/Patek/AP/Breitling) dodają jeszcze 1–2 linki kontekstowe.
 */
const relatedCore = {
  en: [
    { href: '/produkty', label: 'Luxury watch catalogue' },
    { href: '/zegarki-luksusowe-warszawa', label: 'Luxury watches Warsaw' },
    { href: '/zegarki-rolex-warszawa', label: 'Rolex watches' },
    { href: '/zegarki-patek-philippe-warszawa', label: 'Patek Philippe watches' },
    { href: '/jak-weryfikujemy-autentycznosc-zegarka', label: 'How we authenticate watches' },
    { href: '/o-nas', label: 'About the boutique' },
  ],
  ua: [
    { href: '/produkty', label: 'Каталог люксових годинників' },
    { href: '/zegarki-luksusowe-warszawa', label: 'Люксові годинники у Варшаві' },
    { href: '/zegarki-rolex-warszawa', label: 'Годинники Rolex' },
    { href: '/zegarki-patek-philippe-warszawa', label: 'Годинники Patek Philippe' },
    { href: '/jak-weryfikujemy-autentycznosc-zegarka', label: 'Як перевіряємо автентичність' },
    { href: '/o-nas', label: 'Про бутік' },
  ],
} as const

const commonSteps = {
  en: [
    { title: 'Brief', description: 'Tell us the brand, reference, budget and expected timing.' },
    { title: 'Verification', description: 'We check authenticity, documents, service history and market value.' },
    { title: 'Private meeting', description: 'We meet in the boutique at Mokotowska 71 or arrange a remote consultation.' },
    { title: 'Finalisation', description: 'You receive a clear offer, documentation and discreet support until completion.' },
  ],
  ua: [
    { title: 'Бриф', description: 'Вкажіть бренд, референс, бюджет і бажані строки.' },
    { title: 'Перевірка', description: 'Ми перевіряємо автентичність, документи, сервісну історію та ринкову вартість.' },
    { title: 'Приватна зустріч', description: 'Зустрічаємося в бутіку на Mokotowska 71 або проводимо дистанційну консультацію.' },
    { title: 'Завершення', description: 'Ви отримуєте зрозумілу пропозицію, документи та дискретний супровід.' },
  ],
} as const

const commonFaq = {
  en: [
    { q: 'Is the consultation free?', a: 'Yes. The initial consultation and preliminary valuation are free and non-binding.' },
    { q: 'Do I need full papers and box?', a: 'They help value and sell a watch, but lack of papers does not automatically exclude a transaction. We verify every piece individually.' },
    { q: 'Can the process be handled remotely?', a: 'Yes. We can start from photos, video and documentation, then arrange insured shipping or a boutique appointment.' },
  ],
  ua: [
    { q: 'Консультація безкоштовна?', a: 'Так. Початкова консультація та попередня оцінка безкоштовні й ні до чого не зобов’язують.' },
    { q: 'Чи потрібні повний комплект документів і коробка?', a: 'Вони допомагають в оцінці та продажу, але їх відсутність не виключає угоду. Кожен екземпляр перевіряємо окремо.' },
    { q: 'Чи можна пройти процес дистанційно?', a: 'Так. Ми можемо почати з фотографій, відео та документів, а потім організувати застраховану доставку або зустріч у бутіку.' },
  ],
} as const

function buildDefinitions(products: Product[]) {
  return {
  'skup-zegarkow-warszawa': {
    en: {
      title: 'Sell luxury watches in Warsaw - valuation in 15 minutes',
      description:
        'Sell a luxury watch in Warsaw. Fast valuation, immediate payment, full discretion. Rolex, Patek Philippe, Audemars Piguet, Omega and Cartier at Mokotowska 71.',
      h1: 'Sell luxury watches in Warsaw',
      eyebrow: 'Watch buying · Warsaw',
      intro:
        'Sell your premium watch without auctions or intermediaries. We provide a preliminary valuation from photos in about 15 minutes and finalise in our Warsaw boutique with cash or bank transfer.',
      cta: 'Value my watch',
      topic: 'sell luxury watches in Warsaw',
      serviceName: 'Luxury watch buying in Warsaw',
      serviceType: 'Luxury watch buying',
    },
    ua: {
      title: 'Викуп люксових годинників у Варшаві - оцінка за 15 хвилин',
      description:
        'Викуп люксових годинників у Варшаві. Швидка оцінка, негайна оплата, повна дискретність. Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier.',
      h1: 'Викуп люксових годинників у Варшаві',
      eyebrow: 'Викуп годинників · Варшава',
      intro:
        'Продайте преміальний годинник без аукціонів і посередників. Попередню оцінку за фото надаємо приблизно за 15 хвилин, а угоду завершуємо в бутіку у Варшаві.',
      cta: 'Оцінити годинник',
      topic: 'викуп люксових годинників у Варшаві',
      serviceName: 'Викуп люксових годинників у Варшаві',
      serviceType: 'Викуп годинників',
    },
  },
  'skup-rolex-warszawa': {
    en: {
      title: 'Sell Rolex in Warsaw - Submariner, Daytona, GMT-Master, Datejust',
      description:
        'Sell a Rolex in Warsaw with expert verification and fast payment. Daytona, Submariner, GMT-Master, Datejust, Day-Date and Yacht-Master.',
      h1: 'Sell Rolex watches in Warsaw',
      eyebrow: 'Rolex buying · Warsaw',
      intro:
        'We buy and value Rolex watches in Warsaw with discreet service, market-based pricing and careful verification of every reference, from Submariner to Daytona.',
      cta: 'Value my Rolex',
      topic: 'sell Rolex in Warsaw',
      serviceName: 'Rolex buying in Warsaw',
      serviceType: 'Rolex watch buying',
      products: productsByBrand(products, 'Rolex', 6),
    },
    ua: {
      title: 'Викуп Rolex у Варшаві - Submariner, Daytona, GMT-Master, Datejust',
      description:
        'Викуп Rolex у Варшаві з експертною перевіркою та швидкою оплатою. Daytona, Submariner, GMT-Master, Datejust, Day-Date, Yacht-Master.',
      h1: 'Викуп годинників Rolex у Варшаві',
      eyebrow: 'Викуп Rolex · Варшава',
      intro:
        'Ми купуємо й оцінюємо Rolex у Варшаві з дискретним сервісом, ринковою ціною та ретельною перевіркою кожного референсу.',
      cta: 'Оцінити Rolex',
      topic: 'викуп Rolex у Варшаві',
      serviceName: 'Викуп Rolex у Варшаві',
      serviceType: 'Викуп Rolex',
      products: productsByBrand(products, 'Rolex', 6),
    },
  },
  'wycena-zegarka-warszawa': {
    en: {
      title: 'Watch valuation Warsaw - free appraisal from photos or boutique',
      description:
        'Professional watch valuation in Warsaw. Free, non-binding appraisal for Rolex, Patek Philippe, Audemars Piguet, Omega and Cartier.',
      h1: 'Professional watch valuation in Warsaw',
      eyebrow: 'Watch valuation · Warsaw',
      intro:
        'Find out what your watch is worth. We value premium mechanical watches from photos or in the boutique at Mokotowska 71, with no obligation to sell.',
      cta: 'Get a valuation',
      topic: 'watch valuation in Warsaw',
      serviceName: 'Watch valuation in Warsaw',
      serviceType: 'Watch valuation',
    },
    ua: {
      title: 'Оцінка годинника у Варшаві - безкоштовно за фото або в бутіку',
      description:
        'Професійна оцінка годинника у Варшаві. Безкоштовно та без зобов’язань для Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier.',
      h1: 'Професійна оцінка годинника у Варшаві',
      eyebrow: 'Оцінка годинника · Варшава',
      intro:
        'Дізнайтеся вартість свого годинника. Ми оцінюємо преміальні механічні годинники за фото або в бутіку на Mokotowska 71, без зобов’язання продавати.',
      cta: 'Отримати оцінку',
      topic: 'оцінка годинника у Варшаві',
      serviceName: 'Оцінка годинника у Варшаві',
      serviceType: 'Оцінка годинників',
    },
  },
  'komis-zegarkow-warszawa': {
    en: {
      title: 'Watch consignment Warsaw - discreet premium sale',
      description:
        'Luxury watch consignment in Warsaw. Boutique presentation, collector reach and a higher potential price than immediate buyout.',
      h1: 'Luxury watch consignment in Warsaw',
      eyebrow: 'Watch consignment · Warsaw',
      intro:
        'If you want a stronger retail price and can wait, leave your watch on consignment. We present it in the boutique and to a curated collector base.',
      cta: 'Consign my watch',
      topic: 'watch consignment in Warsaw',
      serviceName: 'Luxury watch consignment in Warsaw',
      serviceType: 'Watch consignment',
    },
    ua: {
      title: 'Комісійний продаж годинників у Варшаві - дискретний преміальний сервіс',
      description:
        'Комісійний продаж люксових годинників у Варшаві. Презентація в бутіку, база колекціонерів і потенційно вища ціна.',
      h1: 'Комісійний продаж люксових годинників у Варшаві',
      eyebrow: 'Комісія · Варшава',
      intro:
        'Якщо ви хочете отримати вищу роздрібну ціну й можете зачекати, залиште годинник на комісію. Ми презентуємо його в бутіку та колекціонерам.',
      cta: 'Передати годинник на комісію',
      topic: 'комісійний продаж годинників у Варшаві',
      serviceName: 'Комісійний продаж годинників у Варшаві',
      serviceType: 'Комісійний продаж годинників',
    },
  },
  'skup-zegarkow-centrum-warszawy': {
    en: {
      title: 'Watch buying in central Warsaw - Mokotowska 71',
      description:
        'Sell a luxury watch in central Warsaw. Boutique at Mokotowska 71, quick valuation, discreet payment and expert verification.',
      h1: 'Watch buying in the centre of Warsaw',
      eyebrow: 'Central Warsaw · Watch buying',
      intro:
        'Our boutique at Mokotowska 71 makes selling or valuing a premium watch convenient, discreet and close to the city centre.',
      cta: 'Arrange a valuation',
      topic: 'watch buying in central Warsaw',
      serviceName: 'Watch buying in central Warsaw',
      serviceType: 'Watch buying',
    },
    ua: {
      title: 'Викуп годинників у центрі Варшави - Mokotowska 71',
      description:
        'Продаж люксового годинника в центрі Варшави. Бутік на Mokotowska 71, швидка оцінка, дискретна оплата й експертна перевірка.',
      h1: 'Викуп годинників у центрі Варшави',
      eyebrow: 'Центр Варшави · Викуп',
      intro:
        'Бутік на Mokotowska 71 дозволяє зручно та дискретно продати або оцінити преміальний годинник у центрі міста.',
      cta: 'Домовитися про оцінку',
      topic: 'викуп годинників у центрі Варшави',
      serviceName: 'Викуп годинників у центрі Варшави',
      serviceType: 'Викуп годинників',
    },
  },
  'zegarki-luksusowe-warszawa': {
    en: {
      title: 'Luxury watches Warsaw - exclusive Rolex, Patek Philippe, Cartier',
      description:
        'Exclusive watches in Warsaw: Rolex, Patek Philippe, Audemars Piguet, Cartier, Omega and collector-grade pieces with authenticity verification.',
      h1: 'Luxury watches in Warsaw',
      eyebrow: 'Exclusive watches · Warsaw',
      intro:
        'A curated selection of exclusive watches in Warsaw for collectors and private clients looking for verified Rolex, Patek Philippe, Audemars Piguet, Cartier and Omega pieces.',
      cta: 'View exclusive watches',
      topic: 'exclusive watches in Warsaw',
      serviceName: 'Luxury watches in Warsaw',
      serviceType: 'Luxury watch sales',
      products: sportWatches(products, 6),
    },
    ua: {
      title: 'Люксові годинники у Варшаві - Rolex, Patek Philippe, Cartier',
      description:
        'Ексклюзивні годинники у Варшаві: Rolex, Patek Philippe, Audemars Piguet, Cartier, Omega з перевіркою автентичності.',
      h1: 'Люксові годинники у Варшаві',
      eyebrow: 'Ексклюзивні годинники · Варшава',
      intro:
        'Кураторська добірка ексклюзивних годинників у Варшаві для колекціонерів і приватних клієнтів, які шукають перевірені Rolex, Patek Philippe, Audemars Piguet, Cartier та Omega.',
      cta: 'Переглянути годинники',
      topic: 'ексклюзивні годинники у Варшаві',
      serviceName: 'Люксові годинники у Варшаві',
      serviceType: 'Продаж люксових годинників',
      products: sportWatches(products, 6),
    },
  },
  'zegarki-uzywane-warszawa': {
    en: {
      title: 'Pre-owned luxury watches Warsaw - verified used watches',
      description:
        'Pre-owned luxury watches in Warsaw with authenticity checks, boutique guarantee and discreet consultation.',
      h1: 'Pre-owned luxury watches in Warsaw',
      eyebrow: 'Pre-owned watches · Warsaw',
      intro:
        'Used luxury watches can be the most interesting part of the market when condition, provenance and originality are verified properly.',
      cta: 'View pre-owned watches',
      topic: 'pre-owned luxury watches in Warsaw',
      serviceName: 'Pre-owned luxury watches in Warsaw',
      serviceType: 'Pre-owned watch sales',
      products: vintageWatches(products, 6),
    },
    ua: {
      title: 'Вживані люксові годинники у Варшаві - перевірені екземпляри',
      description:
        'Вживані люксові годинники у Варшаві з перевіркою автентичності, гарантією бутіка та дискретною консультацією.',
      h1: 'Вживані люксові годинники у Варшаві',
      eyebrow: 'Вживані годинники · Варшава',
      intro:
        'Ринок вживаних люксових годинників особливо цікавий, коли стан, походження та оригінальність перевірені професійно.',
      cta: 'Переглянути годинники',
      topic: 'вживані люксові годинники у Варшаві',
      serviceName: 'Вживані люксові годинники у Варшаві',
      serviceType: 'Продаж вживаних годинників',
      products: vintageWatches(products, 6),
    },
  },
  'zegarki-rolex-warszawa': {
    brand: 'Rolex',
  },
  'zegarki-omega-warszawa': {
    brand: 'Omega',
  },
  'zegarki-cartier-warszawa': {
    brand: 'Cartier',
  },
  'zegarki-damskie-warszawa': {
    en: {
      title: 'Ladies luxury watches Warsaw - Cartier, Chopard, Omega, Rolex',
      description:
        'Ladies luxury watches in Warsaw: Cartier, Chopard, Omega, Rolex and jewellery watches with diamonds, gold and mother-of-pearl.',
      h1: 'Ladies luxury watches in Warsaw',
      eyebrow: 'Ladies watches · Warsaw',
      intro:
        'A refined selection of women’s watches and jewellery watches in Warsaw: discreet daily pieces, diamond-set designs and collectible references.',
      cta: 'View ladies watches',
      topic: 'ladies luxury watches in Warsaw',
      serviceName: 'Ladies luxury watches in Warsaw',
      serviceType: 'Ladies watch sales',
      products: ladiesWatches(products, 6),
    },
    ua: {
      title: 'Жіночі люксові годинники у Варшаві - Cartier, Chopard, Omega, Rolex',
      description:
        'Жіночі люксові годинники у Варшаві: Cartier, Chopard, Omega, Rolex, ювелірні моделі з діамантами, золотом і перламутром.',
      h1: 'Жіночі люксові годинники у Варшаві',
      eyebrow: 'Жіночі годинники · Варшава',
      intro:
        'Вишукана добірка жіночих і ювелірних годинників у Варшаві: стримані щоденні моделі, діамантові дизайни та колекційні референси.',
      cta: 'Переглянути жіночі годинники',
      topic: 'жіночі люксові годинники у Варшаві',
      serviceName: 'Жіночі люксові годинники у Варшаві',
      serviceType: 'Продаж жіночих годинників',
      products: ladiesWatches(products, 6),
    },
  },
  'zegarki-ze-zlota-warszawa': {
    en: {
      title: 'Gold watches Warsaw - yellow, rose and white gold watches',
      description:
        'Gold watches in Warsaw: Rolex Day-Date, Cartier, Patek Philippe, Chopard and other luxury watches in yellow, rose and white gold.',
      h1: 'Gold luxury watches in Warsaw',
      eyebrow: 'Gold watches · Warsaw',
      intro:
        'Gold watches combine mechanical value with jewellery presence. We present verified pieces in yellow, rose and white gold, from discreet dress watches to statement icons.',
      cta: 'View gold watches',
      topic: 'gold watches in Warsaw',
      serviceName: 'Gold watches in Warsaw',
      serviceType: 'Gold watch sales',
      products: goldWatches(products, 6),
    },
    ua: {
      title: 'Золоті годинники у Варшаві - жовте, рожеве та біле золото',
      description:
        'Золоті годинники у Варшаві: Rolex Day-Date, Cartier, Patek Philippe, Chopard та інші люксові моделі з жовтого, рожевого й білого золота.',
      h1: 'Золоті люксові годинники у Варшаві',
      eyebrow: 'Золоті годинники · Варшава',
      intro:
        'Золоті годинники поєднують механічну цінність із ювелірною присутністю. Ми представляємо перевірені моделі з жовтого, рожевого та білого золота.',
      cta: 'Переглянути золоті годинники',
      topic: 'золоті годинники у Варшаві',
      serviceName: 'Золоті годинники у Варшаві',
      serviceType: 'Продаж золотих годинників',
      products: goldWatches(products, 6),
    },
  },
  'zegarki-z-diamentami-warszawa': {
    en: {
      title: 'Diamond watches Warsaw - luxury watches with diamonds',
      description:
        'Diamond watches in Warsaw: Cartier, Chopard, Rolex, Bvlgari and jewellery watches with verified stones and boutique presentation.',
      h1: 'Diamond watches in Warsaw',
      eyebrow: 'Diamond watches · Warsaw',
      intro:
        'Luxury watches with diamonds require both watchmaking and jewellery expertise. We select, verify and present diamond-set pieces with discretion.',
      cta: 'View diamond watches',
      topic: 'diamond watches in Warsaw',
      serviceName: 'Diamond watches in Warsaw',
      serviceType: 'Diamond watch sales',
      products: diamondWatches(products, 6),
    },
    ua: {
      title: 'Годинники з діамантами у Варшаві - люксові ювелірні моделі',
      description:
        'Годинники з діамантами у Варшаві: Cartier, Chopard, Rolex, Bvlgari та ювелірні моделі з перевіреними каменями.',
      h1: 'Годинники з діамантами у Варшаві',
      eyebrow: 'Діамантові годинники · Варшава',
      intro:
        'Люксові годинники з діамантами потребують годинникової та ювелірної експертизи. Ми відбираємо й перевіряємо такі екземпляри дискретно.',
      cta: 'Переглянути діамантові годинники',
      topic: 'годинники з діамантами у Варшаві',
      serviceName: 'Годинники з діамантами у Варшаві',
      serviceType: 'Продаж діамантових годинників',
      products: diamondWatches(products, 6),
    },
  },
  'chronografy-warszawa': {
    en: {
      title: 'Chronographs Warsaw - Daytona, Speedmaster, Royal Oak Chronograph',
      description:
        'Luxury chronographs in Warsaw: Rolex Daytona, Omega Speedmaster, Audemars Piguet Royal Oak Chronograph, Breitling, IWC and Zenith.',
      h1: 'Luxury chronographs in Warsaw',
      eyebrow: 'Chronographs · Warsaw',
      intro:
        'Explore mechanical chronographs in Warsaw: Daytona, Speedmaster, Royal Oak Chronograph, Portugieser, Navitimer, El Primero and other collector-grade references.',
      cta: 'View chronographs',
      topic: 'luxury chronographs in Warsaw',
      serviceName: 'Luxury chronographs in Warsaw',
      serviceType: 'Chronograph sales',
      products: chronographWatches(products, 6),
    },
    ua: {
      title: 'Хронографи у Варшаві - Daytona, Speedmaster, Royal Oak Chronograph',
      description:
        'Люксові хронографи у Варшаві: Rolex Daytona, Omega Speedmaster, Audemars Piguet Royal Oak Chronograph, Breitling, IWC, Zenith.',
      h1: 'Люксові хронографи у Варшаві',
      eyebrow: 'Хронографи · Варшава',
      intro:
        'Механічні хронографи у Варшаві: Daytona, Speedmaster, Royal Oak Chronograph, Portugieser, Navitimer, El Primero та інші колекційні референси.',
      cta: 'Переглянути хронографи',
      topic: 'люксові хронографи у Варшаві',
      serviceName: 'Люксові хронографи у Варшаві',
      serviceType: 'Продаж хронографів',
      products: chronographWatches(products, 6),
    },
  },
  'zegarki-na-zamowienie': {
    en: {
      title: 'Watches on request Warsaw - sourcing rare luxury watches',
      description:
        'Luxury watches on request in Warsaw. We source specific Rolex, Patek Philippe, Audemars Piguet, Cartier and Omega references with verification.',
      h1: 'Luxury watches on request',
      eyebrow: 'Sourcing · On request',
      intro:
        'Looking for a specific reference? We source rare and hard-to-find watches through a trusted network, then verify authenticity, condition and documentation.',
      cta: 'Start a search',
      topic: 'luxury watches on request',
      serviceName: 'Luxury watches on request',
      serviceType: 'Watch sourcing',
      areaServed: 'Poland',
    },
    ua: {
      title: 'Годинники на замовлення у Варшаві - пошук рідкісних моделей',
      description:
        'Люксові годинники на замовлення у Варшаві. Шукаємо конкретні Rolex, Patek Philippe, Audemars Piguet, Cartier та Omega з перевіркою.',
      h1: 'Люксові годинники на замовлення',
      eyebrow: 'Пошук · На замовлення',
      intro:
        'Шукаєте конкретний референс? Ми знаходимо рідкісні й важкодоступні годинники через перевірену мережу та перевіряємо їх автентичність, стан і документи.',
      cta: 'Почати пошук',
      topic: 'люксові годинники на замовлення',
      serviceName: 'Люксові годинники на замовлення',
      serviceType: 'Пошук годинників',
      areaServed: 'Poland',
    },
  },
  'rolex-na-zamowienie': { brand: 'Rolex', onRequest: true },
  'patek-philippe-na-zamowienie': { brand: 'Patek Philippe', onRequest: true },
  'audemars-piguet-na-zamowienie': { brand: 'Audemars Piguet', onRequest: true },
  'zegarki-patek-philippe-warszawa': { brand: 'Patek Philippe' },
  'zegarki-audemars-piguet-warszawa': { brand: 'Audemars Piguet' },
  'zegarki-breitling-warszawa': { brand: 'Breitling' },
  'o-nas': {
    en: {
      title: 'About Warszawski Czas - premium watch boutique at Mokotowska 71, Warsaw',
      description:
        'About Warszawski Czas — an independent boutique of luxury watches in central Warsaw since 2019. Sales, sourcing, buying, consignment and service of Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling and other premium brands.',
      h1: 'Warszawski Czas — a premium watch boutique in the heart of Warsaw',
      eyebrow: 'About the boutique · Mokotowska 71',
      intro:
        'Warszawski Czas is an independent boutique of luxury watches operating in Warsaw since 2019. We specialise in the sale, sourcing, buying and consignment of premium watches — Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling and other renowned brands. Our work is defined by an individual approach to every client, honest and reliable service, and expert advice based on long experience.',
      cta: 'Book a boutique visit',
      topic: 'about Warszawski Czas',
      serviceName: 'Warszawski Czas — premium watch boutique',
      serviceType: 'Luxury watch boutique',
    },
    ua: {
      title: 'Про Warszawski Czas — преміальний бутік годинників на Mokotowska 71, Варшава',
      description:
        'Про Warszawski Czas — незалежний бутік люксових годинників у центрі Варшави з 2019 року. Продаж, пошук, викуп, комісія та сервіс Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling та інших преміальних брендів.',
      h1: 'Warszawski Czas — преміальний бутік годинників у центрі Варшави',
      eyebrow: 'Про бутік · Mokotowska 71',
      intro:
        'Warszawski Czas — незалежний бутік люксових годинників, що працює у Варшаві з 2019 року. Ми спеціалізуємося на продажу, пошуку, викупі та комісії преміальних годинників — Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, Breitling та інших відомих брендів. Нашу роботу визначає індивідуальний підхід до кожного клієнта, чесний та надійний сервіс, експертні поради на основі багаторічного досвіду.',
      cta: 'Записатися на візит',
      topic: 'про Warszawski Czas',
      serviceName: 'Warszawski Czas — преміальний бутік годинників',
      serviceType: 'Бутік люксових годинників',
    },
  },
  'jak-weryfikujemy-autentycznosc-zegarka': {
    en: {
      title: 'How we authenticate watches - the Warszawski Czas verification process',
      description:
        'The full multi-step verification process used at Warszawski Czas for every luxury watch — visual inspection, case markings, movement analysis, documents, service history and completeness. Mokotowska 71, Warsaw.',
      h1: 'How we authenticate luxury watches',
      eyebrow: 'Process · Watchmaking expertise',
      intro:
        'Every watch entering the Warszawski Czas boutique — from sale, sourcing, buying or consignment — goes through a multi-step authenticity and condition verification process. We check visually, compare markings, analyse the movement, verify documents and check completeness. Only after passing all steps does a watch enter the catalogue or reach the client.',
      cta: 'Book an expertise',
      topic: 'how we authenticate luxury watches',
      serviceName: 'Luxury watch authentication in Warsaw',
      serviceType: 'Watch authenticity expertise',
    },
    ua: {
      title: 'Як перевіряємо автентичність годинника — процес експертизи Warszawski Czas',
      description:
        'Повний багатоетапний процес перевірки люксових годинників у Warszawski Czas — візуальна оцінка, маркування корпусу, аналіз механізму, документи, сервісна історія та комплектність. Mokotowska 71, Варшава.',
      h1: 'Як перевіряємо автентичність люксового годинника',
      eyebrow: 'Процес · Годинникова експертиза',
      intro:
        'Кожен годинник, що потрапляє до бутіка Warszawski Czas — з продажу, пошуку, викупу чи комісії — проходить багатоетапну перевірку автентичності та стану. Ми оцінюємо візуально, порівнюємо маркування, аналізуємо механізм, перевіряємо документи та комплектність. Лише після всіх етапів годинник потрапляє до каталогу або до клієнта.',
      cta: 'Записатися на експертизу',
      topic: 'як перевіряємо автентичність годинника',
      serviceName: 'Експертиза автентичності годинника у Варшаві',
      serviceType: 'Експертиза автентичності годинників',
    },
  },
  'zegarki-kolekcjonerskie': {
    en: {
      title: 'Collector watches Warsaw - rare and important references',
      description:
        'Collector watches in Warsaw: rare Rolex, Patek Philippe, Audemars Piguet, Omega and Cartier references selected for provenance and condition.',
      h1: 'Collector watches in Warsaw',
      eyebrow: 'Collector watches',
      intro:
        'Collector value is built on reference, condition, originality, history and scarcity. We help clients buy, sell and source watches with long-term significance.',
      cta: 'Discuss collector watches',
      topic: 'collector watches in Warsaw',
      serviceName: 'Collector watches in Warsaw',
      serviceType: 'Collector watch advisory',
      products: vintageWatches(products, 6),
    },
    ua: {
      title: 'Колекційні годинники у Варшаві - рідкісні та важливі референси',
      description:
        'Колекційні годинники у Варшаві: рідкісні Rolex, Patek Philippe, Audemars Piguet, Omega і Cartier, відібрані за походженням і станом.',
      h1: 'Колекційні годинники у Варшаві',
      eyebrow: 'Колекційні годинники',
      intro:
        'Колекційна цінність залежить від референсу, стану, оригінальності, історії та рідкісності. Ми допомагаємо купувати, продавати й знаходити важливі годинники.',
      cta: 'Обговорити колекційні годинники',
      topic: 'колекційні годинники у Варшаві',
      serviceName: 'Колекційні годинники у Варшаві',
      serviceType: 'Консультації щодо колекційних годинників',
      products: vintageWatches(products, 6),
    },
  },
  } as const
}

type Definitions = ReturnType<typeof buildDefinitions>
type Definition = Definitions[keyof Definitions]

/**
 * Stała lista slugów landingów — żeby nie wymagać pobierania produktów tylko
 * po to, żeby wyciągnąć klucze. Spójna z `buildDefinitions()` powyżej.
 */
export const localizedLandingSlugs = [
  'skup-zegarkow-warszawa',
  'skup-rolex-warszawa',
  'wycena-zegarka-warszawa',
  'komis-zegarkow-warszawa',
  'skup-zegarkow-centrum-warszawy',
  'zegarki-luksusowe-warszawa',
  'zegarki-uzywane-warszawa',
  'zegarki-rolex-warszawa',
  'zegarki-omega-warszawa',
  'zegarki-cartier-warszawa',
  'zegarki-damskie-warszawa',
  'zegarki-ze-zlota-warszawa',
  'zegarki-z-diamentami-warszawa',
  'chronografy-warszawa',
  'zegarki-na-zamowienie',
  'rolex-na-zamowienie',
  'patek-philippe-na-zamowienie',
  'audemars-piguet-na-zamowienie',
  'zegarki-kolekcjonerskie',
  'zegarki-patek-philippe-warszawa',
  'zegarki-audemars-piguet-warszawa',
  'zegarki-breitling-warszawa',
  'o-nas',
  'jak-weryfikujemy-autentycznosc-zegarka',
] as const

function brandDefinition(slug: string, locale: Exclude<Locale, 'pl'>, brand: string, products: Product[], onRequest = false): LandingCopy {
  const brandProducts = productsByBrand(products, brand, 6)
  if (locale === 'en') {
    return buildCopy(slug, locale, {
      title: `${brand} watches Warsaw${onRequest ? ' - sourcing on request' : ' - verified luxury watches'}`,
      description: `${brand} watches in Warsaw. Verified references, boutique presentation, discreet consultation and sourcing on request at Warszawski Czas.`,
      h1: `${brand} watches ${onRequest ? 'on request' : 'in Warsaw'}`,
      eyebrow: `${brand} · Warsaw`,
      intro: `${brand} remains one of the strongest names in the collector watch market. We help clients buy, sell and source verified ${brand} references with clear documentation and boutique-level service.`,
      cta: onRequest ? `Find a ${brand}` : `View ${brand} watches`,
      topic: `${brand} watches in Warsaw`,
      serviceName: `${brand} watches in Warsaw`,
      serviceType: `${brand} watch sales and sourcing`,
      products: brandProducts,
      areaServed: onRequest ? 'Poland' : undefined,
    })
  }

  return buildCopy(slug, locale, {
    title: `${brand} у Варшаві${onRequest ? ' - пошук на замовлення' : ' - перевірені люксові годинники'}`,
    description: `${brand} у Варшаві. Перевірені референси, презентація в бутіку, дискретна консультація та пошук на замовлення у Warszawski Czas.`,
    h1: `${brand} ${onRequest ? 'на замовлення' : 'у Варшаві'}`,
    eyebrow: `${brand} · Варшава`,
    intro: `${brand} залишається одним із найсильніших імен на ринку колекційних годинників. Ми допомагаємо купувати, продавати та знаходити перевірені референси ${brand} з чіткою документацією.`,
    cta: onRequest ? `Знайти ${brand}` : `Переглянути ${brand}`,
    topic: `${brand} у Варшаві`,
    serviceName: `${brand} у Варшаві`,
    serviceType: `Продаж і пошук ${brand}`,
    products: brandProducts,
    areaServed: onRequest ? 'Poland' : undefined,
  })
}

function buildCopy(
  slug: string,
  locale: Exclude<Locale, 'pl'>,
  raw: {
    title: string
    description: string
    h1: string
    eyebrow: string
    intro: string
    cta: string
    topic: string
    serviceName: string
    serviceType: string
    areaServed?: string
    products?: ReturnType<typeof productsByBrand>
  },
): LandingCopy {
  const products = raw.products ?? []
  const en = locale === 'en'
  return {
    locale,
    slug,
    title: raw.title,
    description: raw.description,
    serviceName: raw.serviceName,
    serviceType: raw.serviceType,
    areaServed: raw.areaServed,
    eyebrow: raw.eyebrow,
    h1: raw.h1,
    intro: raw.intro,
    primaryCtaLabel: raw.cta,
    source: `landing-${slug}-${locale}`,
    body: [
      {
        heading: en ? `Why ${raw.topic} requires expertise` : `Чому ${raw.topic} потребує експертизи`,
        paragraphs: en
          ? [
              'The luxury watch market is driven by reference, configuration, condition and provenance. Two watches that look similar online can have very different values once the dial, bracelet, service history and originality are checked carefully.',
              'Warszawski Czas combines boutique presentation with practical market knowledge. We help private clients buy, sell and source exclusive watches in Warsaw without unnecessary exposure and with clear documentation.',
            ]
          : [
              'Ринок люксових годинників залежить від референсу, конфігурації, стану та походження. Два годинники, що схожі онлайн, можуть мати різну ціну після перевірки циферблата, браслета, сервісної історії та оригінальності.',
              'Warszawski Czas поєднує презентацію бутіка з практичним знанням ринку. Ми допомагаємо приватним клієнтам купувати, продавати та знаходити ексклюзивні годинники у Варшаві дискретно й з документами.',
            ],
      },
    ],
    highlights: en
      ? [
          { title: 'Verified pieces', description: 'Authenticity, reference, condition and documentation are checked before any recommendation or sale.' },
          { title: 'Warsaw boutique', description: 'Private meetings take place at Mokotowska 71, with a discreet atmosphere and direct expert support.' },
          { title: 'Collector network', description: 'For hard-to-find models, we use trusted suppliers and collectors instead of anonymous marketplace sourcing.' },
        ]
      : [
          { title: 'Перевірені екземпляри', description: 'Автентичність, референс, стан і документи перевіряються перед рекомендацією або продажем.' },
          { title: 'Бутік у Варшаві', description: 'Приватні зустрічі проходять на Mokotowska 71 у дискретній атмосфері з підтримкою експерта.' },
          { title: 'Мережа колекціонерів', description: 'Для важкодоступних моделей використовуємо перевірених постачальників і колекціонерів, а не анонімні майданчики.' },
        ],
    bulletsHeading: en ? 'What we verify' : 'Що ми перевіряємо',
    bullets: en
      ? [
          'Brand, reference and exact configuration',
          'Case, dial, bracelet, clasp and visible signs of polishing',
          'Movement condition, service history and originality',
          'Box, papers, warranty cards, invoices and accessories',
          'Current market demand in Poland and across Europe',
        ]
      : [
          'Бренд, референс і точну конфігурацію',
          'Корпус, циферблат, браслет, застібку та сліди полірування',
          'Стан механізму, сервісну історію та оригінальність',
          'Коробку, документи, гарантійні картки, рахунки та аксесуари',
          'Поточний попит у Польщі та Європі',
        ],
    brandsHeading: en ? 'Brands we work with most often' : 'Бренди, з якими ми працюємо найчастіше',
    brands: brandList,
    stepsHeading: en ? 'Process' : 'Процес',
    steps: [...commonSteps[locale]],
    productPreview: products.length
      ? {
          heading: en ? 'Selected pieces from the boutique' : 'Вибрані екземпляри з бутіка',
          description: en ? 'A live selection of watches currently presented by Warszawski Czas.' : 'Актуальна добірка годинників, представлених Warszawski Czas.',
          products,
          href: '/produkty',
          hrefLabel: en ? 'Full catalogue' : 'Весь каталог',
        }
      : undefined,
    faq: [...commonFaq[locale]],
    closingHeading: en ? 'Start with a private consultation' : 'Почніть із приватної консультації',
    closingText: en
      ? 'Send photos, a reference number or a short brief. We will reply with the next step and a realistic market view.'
      : 'Надішліть фото, номер референсу або короткий опис. Ми відповімо з наступним кроком і реалістичною ринковою оцінкою.',
    relatedLinks: [...relatedCore[locale]],
  }
}

export async function getLocalizedLanding(
  slug: string,
  locale: Exclude<Locale, 'pl'>,
): Promise<LandingCopy | null> {
  const products = await getAllProducts()
  const definitions = buildDefinitions(products)
  const def = definitions[slug as keyof typeof definitions] as Definition | undefined
  if (!def) return null
  if ('brand' in def) {
    return brandDefinition(slug, locale, def.brand, products, 'onRequest' in def && !!def.onRequest)
  }
  return buildCopy(slug, locale, def[locale])
}
