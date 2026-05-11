'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Cog,
  Gauge,
  Layers,
  Lock,
  ShieldCheck,
  Unlock,
} from 'lucide-react'
import { Container, Section, Magnetic } from '@/components/ui'
import { FadeIn } from '@/components/ui/fade-in'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n'

type FeaturedWatch = {
  id: string
  brand: string
  model: string
  reference: string
  year: string
  condition: string
  status: 'available' | 'reserved'
  editorial: string
  image: string
  specs: { mechanism: string; diameter: string; material: string; boxPapers: string }
  priceLabel: string
}

const copy = {
  pl: {
    statusAvailable: 'Dostępny',
    statusReserved: 'Zarezerwowany',
    prev: 'Poprzedni',
    next: 'Następny',
    prevAria: 'Poprzedni egzemplarz',
    nextAria: 'Następny egzemplarz',
    slideAria: (i: number, n: number) => `${i} z ${n}`,
    dotAria: (i: number) => `Przejdź do egzemplarza ${i}`,
    accessHeadingMobile: 'Odblokuj prezentację',
    accessHeading: 'Odblokuj prezentację',
    accessEyebrow: 'Kod dostępu',
    accessLeadDesktop: 'Egzemplarze ze szczegółami, prowencją i dokumentacją. Wpisz kod od specjalisty albo wypełnij krótki formularz.',
    accessLeadMobile: 'Egzemplarze ze szczegółami i prowencją — wpisz kod od specjalisty albo zarejestruj się.',
    accessPlaceholder: 'Kod dostępu',
    accessSubmit: 'Odblokuj',
    accessSubmitting: 'Sprawdzanie...',
    accessError: 'Nieprawidłowy kod. Zarejestruj się, aby go otrzymać.',
    or: 'lub',
    noCodeCta: 'Nie mam kodu — zarejestruj się',
    unlocked: 'Odblokowano',
    specMechanism: 'Mechanizm',
    specDiameter: 'Średnica',
    specMaterial: 'Materiał',
    specBoxPapers: 'Komplet',
    cert: 'Certyfikat · gwarancja Warszawski Czas',
    priceLabel: 'Cena',
    askCta: 'Zapytaj o ten egzemplarz',
    response: 'Odpowiedź w ciągu 24 godzin',
    featured: [
      {
        id: 'pp-nautilus-5990',
        brand: 'Patek Philippe',
        model: 'Nautilus Travel Time Chronograph',
        reference: '5990/1R-001',
        year: 'ok. 2019',
        condition: 'Stan kolekcjonerski',
        status: 'available',
        editorial:
          'Najbardziej skomplikowany Nautilus, jaki Patek wprowadził do kolekcji — dwie strefy czasowe z rozdzielonymi wskazaniami LOCAL/HOME, chronograf typu flyback i dyskretny datownik dzień/noc, wszystko upakowane w sportową kopertę Genty z lat 70. W wersji 5990/1R różowe złoto przesuwa ten zegarek z kategorii „sportowa elegancja" w stronę nocnej eleganckiej biżuterii — niebieska tarcza z poziomym reliefem łapie światło inaczej co minutę.',
        image: '/patek.jpg',
        specs: {
          mechanism: 'Automat, kal. CH 28-520 C FUS, flyback',
          diameter: '40,5 mm',
          material: 'Złoto różowe 18k, bransoleta integrated',
          boxPapers: 'Pełen komplet, certyfikat Patek Philippe',
        },
        priceLabel: 'Cena na zapytanie',
      },
      {
        id: 'ap-royal-oak-burgundy',
        brand: 'Audemars Piguet',
        model: 'Royal Oak Automatic — Burgundy Dial',
        reference: '14790ST',
        year: 'lata 90.',
        condition: 'Bardzo dobry',
        status: 'available',
        editorial:
          'Royal Oak w klasycznych proporcjach 36 mm — tych, które Gérald Genta narysował w 1972 r. — z niezwykle rzadką burgundową tarczą Petite Tapisserie. Wino, stal i osiem heksagonalnych śrub na stalowym bezelu: kombinacja, która z na pozór codziennego sportowego zegarka robi pozycję trudną do znalezienia poza prywatnymi zbiorami. Burgundowa skóra aligatora dopowiada ton.',
        image: '/ap.jpg',
        specs: {
          mechanism: 'Automat, kal. AP 2225',
          diameter: '36 mm',
          material: 'Stal, pasek aligator',
          boxPapers: 'Dokumentacja serwisowa, oryginalny dial',
        },
        priceLabel: 'Cena na zapytanie',
      },
      {
        id: 'chopard-haute-joaillerie',
        brand: 'Chopard',
        model: 'Haute Joaillerie Chronograph — Full Diamond',
        reference: 'Pièce unique',
        year: 'ok. 2010',
        condition: 'Stan kolekcjonerski',
        status: 'available',
        editorial:
          'Tu nie chodzi już o pomiar czasu — chodzi o światło. Pełna pavéowa tarcza, trzy subtarcze chronografu wycięte w masie diamentów, koperta i bezel z baguettowymi kamieniami i klasycznymi cyframi rzymskimi w złocie. Kategorię tego zegarka Chopard zarezerwował dla najmniejszej, najbardziej dyskretnej linii haute joaillerie — egzemplarze tej skali rzadko opuszczają prywatne kolekcje rodzin szwajcarskich.',
        image: '/chopard.jpg',
        specs: {
          mechanism: 'Automat, chronograph',
          diameter: '38 mm',
          material: 'Białe złoto 18k, ok. 600 diamentów',
          boxPapers: 'Komplet, certyfikat haute joaillerie Chopard',
        },
        priceLabel: 'Cena na zapytanie',
      },
    ] as FeaturedWatch[],
  },
  en: {
    statusAvailable: 'Available',
    statusReserved: 'Reserved',
    prev: 'Previous',
    next: 'Next',
    prevAria: 'Previous piece',
    nextAria: 'Next piece',
    slideAria: (i: number, n: number) => `${i} of ${n}`,
    dotAria: (i: number) => `Go to piece ${i}`,
    accessHeadingMobile: 'Unlock the presentation',
    accessHeading: 'Unlock the presentation',
    accessEyebrow: 'Access code',
    accessLeadDesktop: 'Pieces with full details, provenance and documentation. Enter the code from your specialist or fill in the short form.',
    accessLeadMobile: 'Pieces with full details and provenance — enter the code from your specialist or register.',
    accessPlaceholder: 'Access code',
    accessSubmit: 'Unlock',
    accessSubmitting: 'Checking...',
    accessError: 'Invalid code. Register to receive one.',
    or: 'or',
    noCodeCta: 'No code — register',
    unlocked: 'Unlocked',
    specMechanism: 'Movement',
    specDiameter: 'Diameter',
    specMaterial: 'Material',
    specBoxPapers: 'Set',
    cert: 'Certificate · Warszawski Czas warranty',
    priceLabel: 'Price',
    askCta: 'Ask about this piece',
    response: 'Reply within 24 hours',
    featured: [
      {
        id: 'pp-nautilus-5990',
        brand: 'Patek Philippe',
        model: 'Nautilus Travel Time Chronograph',
        reference: '5990/1R-001',
        year: 'c. 2019',
        condition: 'Collector condition',
        status: 'available',
        editorial:
          "The most complicated Nautilus Patek has placed in the collection — two time zones with separate LOCAL/HOME indications, a flyback chronograph and a discreet day/night date, all packed inside Genta's 1970s sports case. In the 5990/1R the rose gold shifts this watch from \"sport elegance\" toward evening fine jewellery — the blue dial with horizontal relief catches the light differently every minute.",
        image: '/patek.jpg',
        specs: {
          mechanism: 'Automatic, cal. CH 28-520 C FUS, flyback',
          diameter: '40.5 mm',
          material: '18k rose gold, integrated bracelet',
          boxPapers: 'Full set, Patek Philippe certificate',
        },
        priceLabel: 'Price on request',
      },
      {
        id: 'ap-royal-oak-burgundy',
        brand: 'Audemars Piguet',
        model: 'Royal Oak Automatic — Burgundy Dial',
        reference: '14790ST',
        year: '1990s',
        condition: 'Very good',
        status: 'available',
        editorial:
          "A Royal Oak in the classic 36 mm proportions — the ones Gérald Genta drew in 1972 — with an exceptionally rare burgundy Petite Tapisserie dial. Wine, steel and eight hexagonal screws on a steel bezel: a combination that turns an apparently everyday sports watch into a piece hard to find outside private collections. The burgundy alligator strap completes the tone.",
        image: '/ap.jpg',
        specs: {
          mechanism: 'Automatic, cal. AP 2225',
          diameter: '36 mm',
          material: 'Steel, alligator strap',
          boxPapers: 'Service records, original dial',
        },
        priceLabel: 'Price on request',
      },
      {
        id: 'chopard-haute-joaillerie',
        brand: 'Chopard',
        model: 'Haute Joaillerie Chronograph — Full Diamond',
        reference: 'Pièce unique',
        year: 'c. 2010',
        condition: 'Collector condition',
        status: 'available',
        editorial:
          "This is no longer about measuring time — it is about light. A full pavé dial, three chronograph sub-dials cut from a mass of diamonds, a case and bezel set with baguette stones and classical Roman numerals in gold. Chopard reserved this category for the smallest, most discreet line of haute joaillerie — pieces of this scale rarely leave the private collections of Swiss families.",
        image: '/chopard.jpg',
        specs: {
          mechanism: 'Automatic, chronograph',
          diameter: '38 mm',
          material: '18k white gold, c. 600 diamonds',
          boxPapers: 'Full set, Chopard haute joaillerie certificate',
        },
        priceLabel: 'Price on request',
      },
    ] as FeaturedWatch[],
  },
  ua: {
    statusAvailable: 'Доступний',
    statusReserved: 'Зарезервований',
    prev: 'Попередній',
    next: 'Наступний',
    prevAria: 'Попередній екземпляр',
    nextAria: 'Наступний екземпляр',
    slideAria: (i: number, n: number) => `${i} з ${n}`,
    dotAria: (i: number) => `Перейти до екземпляра ${i}`,
    accessHeadingMobile: 'Розблокувати презентацію',
    accessHeading: 'Розблокувати презентацію',
    accessEyebrow: 'Код доступу',
    accessLeadDesktop: 'Екземпляри з деталями, провенансом і документами. Введіть код від спеціаліста або заповніть коротку форму.',
    accessLeadMobile: 'Екземпляри з деталями та провенансом — введіть код від спеціаліста або зареєструйтеся.',
    accessPlaceholder: 'Код доступу',
    accessSubmit: 'Розблокувати',
    accessSubmitting: 'Перевірка...',
    accessError: 'Неправильний код. Зареєструйтеся, щоб отримати.',
    or: 'або',
    noCodeCta: 'Немає коду — зареєструйтеся',
    unlocked: 'Розблоковано',
    specMechanism: 'Механізм',
    specDiameter: 'Діаметр',
    specMaterial: 'Матеріал',
    specBoxPapers: 'Комплект',
    cert: 'Сертифікат · гарантія Warszawski Czas',
    priceLabel: 'Ціна',
    askCta: 'Запитати про цей екземпляр',
    response: 'Відповідь протягом 24 годин',
    featured: [
      {
        id: 'pp-nautilus-5990',
        brand: 'Patek Philippe',
        model: 'Nautilus Travel Time Chronograph',
        reference: '5990/1R-001',
        year: 'бл. 2019',
        condition: 'Колекційний стан',
        status: 'available',
        editorial:
          'Найскладніший Nautilus, який Patek представив у колекції — два часові пояси з окремими індикаціями LOCAL/HOME, флайбек-хронограф і дискретна індикація день/ніч, усе в спортивному корпусі Genta з 1970-х. У версії 5990/1R рожеве золото переводить цей годинник із категорії «спортивна елегантність» у вечірні ювелірні аксесуари — синій циферблат із горизонтальним рельєфом ловить світло по-різному щохвилини.',
        image: '/patek.jpg',
        specs: {
          mechanism: 'Автомат, кал. CH 28-520 C FUS, флайбек',
          diameter: '40,5 мм',
          material: 'Рожеве золото 18к, інтегрований браслет',
          boxPapers: 'Повний комплект, сертифікат Patek Philippe',
        },
        priceLabel: 'Ціна за запитом',
      },
      {
        id: 'ap-royal-oak-burgundy',
        brand: 'Audemars Piguet',
        model: 'Royal Oak Automatic — Burgundy Dial',
        reference: '14790ST',
        year: '1990-ті',
        condition: 'Дуже добрий',
        status: 'available',
        editorial:
          'Royal Oak у класичних пропорціях 36 мм — тих, які Жеральд Жента намалював у 1972 р., — з надзвичайно рідкісним бордовим циферблатом Petite Tapisserie. Вино, сталь і вісім шестикутних гвинтів на сталевому безелі: комбінація, що перетворює, здавалося б, повсякденний спортивний годинник на екземпляр, який важко знайти поза приватними колекціями.',
        image: '/ap.jpg',
        specs: {
          mechanism: 'Автомат, кал. AP 2225',
          diameter: '36 мм',
          material: 'Сталь, ремінець з алігатора',
          boxPapers: 'Сервісна документація, оригінальний циферблат',
        },
        priceLabel: 'Ціна за запитом',
      },
      {
        id: 'chopard-haute-joaillerie',
        brand: 'Chopard',
        model: 'Haute Joaillerie Chronograph — Full Diamond',
        reference: 'Pièce unique',
        year: 'бл. 2010',
        condition: 'Колекційний стан',
        status: 'available',
        editorial:
          'Тут уже не йдеться про вимірювання часу — йдеться про світло. Повністю діамантовий циферблат, три субциферблати хронографа, вирізані в масі діамантів, корпус і безель з багетними каменями та класичними римськими цифрами із золота. Цю категорію Chopard зарезервував для найменшої, найдискретнішої лінії haute joaillerie — екземпляри такого рівня рідко залишають приватні колекції швейцарських родин.',
        image: '/chopard.jpg',
        specs: {
          mechanism: 'Автомат, хронограф',
          diameter: '38 мм',
          material: 'Біле золото 18к, бл. 600 діамантів',
          boxPapers: 'Комплект, сертифікат Chopard haute joaillerie',
        },
        priceLabel: 'Ціна за запитом',
      },
    ] as FeaturedWatch[],
  },
} as const

export function PrivateCollectionFeatured({ locale = 'pl' }: { locale?: Locale } = {}) {
  const t = copy[locale]
  const featured = t.featured

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: false, duration: 35 },
    [Autoplay({ delay: 7500, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/private-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) { setUnlocked(true); setError(false) } else { setError(true) }
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToRegistration = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById('registration')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section spacing="xl" className="relative overflow-hidden bg-[#f3ead9] text-[#1f1813]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '220px 220px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(201,169,98,0.18)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(122,76,38,0.12)_0%,transparent_50%)]" />

      <Container size="wide" className="relative">
        {!unlocked && (
          <FadeIn delay={0.15} className="lg:hidden">
            <MobileLockCard
              t={t}
              code={code}
              error={error}
              onCodeChange={(v) => { setCode(v); if (error) setError(false) }}
              onSubmit={handleUnlock}
              onScrollToRegistration={scrollToRegistration}
            />
          </FadeIn>
        )}

        <div
          className={cn(
            'relative overflow-hidden transition-[max-height,opacity,margin] duration-[800ms] ease-out lg:!max-h-none lg:!overflow-visible lg:!opacity-100',
            unlocked ? 'max-h-[8000px] opacity-100' : 'pointer-events-none max-h-0 opacity-0 lg:pointer-events-auto'
          )}
        >
          <FadeIn delay={0.15}>
            <div className="relative">
              <div className="pointer-events-none absolute -bottom-5 -right-5 hidden h-full w-full border border-[#8a6a2c]/30 lg:block" />
              <div className="pointer-events-none absolute -top-5 -left-5 hidden h-full w-full border border-[#8a6a2c]/15 lg:block" />

              <div className="relative bg-[#fbf6ec] shadow-[0_30px_80px_-30px_rgba(58,30,12,0.35)]">
                <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

                <div
                  className={cn(
                    'transition-all duration-1000 ease-out',
                    !unlocked && 'pointer-events-none select-none [filter:blur(14px)_saturate(0.85)] opacity-90'
                  )}
                  aria-hidden={!unlocked}
                >
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                      {featured.map((w, i) => (
                        <div
                          key={w.id}
                          className="min-w-0 flex-[0_0_100%]"
                          role="group"
                          aria-roledescription="slide"
                          aria-label={t.slideAria(i + 1, featured.length)}
                        >
                          <FeaturedSlide watch={w} t={t} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#8a6a2c]/15 bg-[#f7efe0] px-6 py-5 sm:px-10 lg:px-14">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      aria-label={t.prevAria}
                      tabIndex={unlocked ? 0 : -1}
                      className="group flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.35em] text-[#3d2f24]/70 transition-colors duration-300 hover:text-[#8a6a2c]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center border border-[#8a6a2c]/40 transition-colors duration-300 group-hover:border-[#8a6a2c] group-hover:bg-[#8a6a2c] group-hover:text-[#fbf6ec]">
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                      <span className="hidden sm:inline">{t.prev}</span>
                    </button>

                    <div className="flex items-center gap-4">
                      <span className="font-serif text-xs italic text-[#3d2f24]/60">
                        {String(selectedIndex + 1).padStart(2, '0')}{' '}
                        <span className="text-[#3d2f24]/30">/</span>{' '}
                        {String(featured.length).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-2">
                        {featured.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => scrollTo(i)}
                            tabIndex={unlocked ? 0 : -1}
                            aria-label={t.dotAria(i + 1)}
                            aria-current={i === selectedIndex}
                            className={cn(
                              'h-[2px] transition-all duration-500',
                              i === selectedIndex ? 'w-10 bg-[#8a6a2c]' : 'w-5 bg-[#8a6a2c]/25 hover:bg-[#8a6a2c]/50'
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={scrollNext}
                      aria-label={t.nextAria}
                      tabIndex={unlocked ? 0 : -1}
                      className="group flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-[0.35em] text-[#3d2f24]/70 transition-colors duration-300 hover:text-[#8a6a2c]"
                    >
                      <span className="hidden sm:inline">{t.next}</span>
                      <span className="flex h-10 w-10 items-center justify-center border border-[#8a6a2c]/40 transition-colors duration-300 group-hover:border-[#8a6a2c] group-hover:bg-[#8a6a2c] group-hover:text-[#fbf6ec]">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                  </div>
                </div>

                {!unlocked && (
                  <div
                    className="absolute inset-0 z-10 hidden items-center justify-center px-6 py-10 lg:flex lg:px-12 lg:py-16"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(243,234,217,0.55) 0%, rgba(243,234,217,0.85) 100%)',
                      backdropFilter: 'blur(2px)',
                    }}
                  >
                    <div className="w-full max-w-md bg-[#1f1813] p-8 text-white shadow-[0_30px_70px_-20px_rgba(31,24,19,0.6)] sm:p-10">
                      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center border border-[#c9a962]/50 bg-[#c9a962]/10">
                          <Lock className="h-4 w-4 text-[#c9a962]" />
                        </span>
                        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#c9a962]">
                          {t.accessEyebrow}
                        </p>
                      </div>

                      <h3 className="mt-6 font-serif text-2xl font-medium leading-tight text-white sm:text-[1.75rem]">
                        {t.accessHeading}
                      </h3>

                      <p className="mt-4 text-sm leading-relaxed text-white/55 text-pretty">
                        {t.accessLeadDesktop}
                      </p>

                      <form onSubmit={handleUnlock} className="mt-8 space-y-4">
                        <label htmlFor="featured-code" className="sr-only">
                          {t.accessEyebrow}
                        </label>
                        <input
                          id="featured-code"
                          type="text"
                          value={code}
                          onChange={(e) => { setCode(e.target.value); if (error) setError(false) }}
                          placeholder={t.accessPlaceholder}
                          className="block w-full border border-white/20 bg-transparent px-4 py-3 font-sans text-sm uppercase tracking-[0.3em] text-white placeholder:text-white/30 focus:border-[#c9a962] focus:outline-none focus:ring-0"
                          autoComplete="off"
                        />

                        <button
                          type="submit"
                          disabled={submitting}
                          className={cn('btn-premium-white w-full', submitting && 'cursor-wait opacity-70')}
                          style={{ display: 'block' }}
                        >
                          {submitting ? t.accessSubmitting : t.accessSubmit}
                        </button>

                        {error && (
                          <p className="text-[11px] font-sans text-red-300">{t.accessError}</p>
                        )}
                      </form>

                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/30">{t.or}</span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      <a
                        href="#registration"
                        onClick={scrollToRegistration}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a962] hover:text-[#dab97c] transition-colors"
                      >
                        {t.noCodeCta}
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {unlocked && (
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-2 bg-[#1f1813]/85 px-3 py-1.5 backdrop-blur-sm">
                    <Unlock className="h-3 w-3 text-[#c9a962]" />
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-[#c9a962]">
                      {t.unlocked}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>

      </Container>
    </Section>
  )
}

type CopyT = (typeof copy)[Locale]

function MobileLockCard({
  t,
  code,
  error,
  onCodeChange,
  onSubmit,
  onScrollToRegistration,
}: {
  t: CopyT
  code: string
  error: boolean
  onCodeChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onScrollToRegistration: (e: React.MouseEvent) => void
}) {
  return (
    <div className="relative bg-[#1f1813] p-7 text-white shadow-[0_30px_70px_-20px_rgba(31,24,19,0.55)] sm:p-9">
      <div className="mb-7 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962] to-transparent" />

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center border border-[#c9a962]/50 bg-[#c9a962]/10">
          <Lock className="h-4 w-4 text-[#c9a962]" />
        </span>
        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#c9a962]">
          {t.accessEyebrow}
        </p>
      </div>

      <h3 className="mt-5 font-serif text-[1.6rem] font-medium leading-tight text-white">
        {t.accessHeadingMobile}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-white/55 text-pretty">
        {t.accessLeadMobile}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={t.accessPlaceholder}
          className="block w-full border border-white/20 bg-transparent px-4 py-3 font-sans text-sm uppercase tracking-[0.3em] text-white placeholder:text-white/30 focus:border-[#c9a962] focus:outline-none focus:ring-0"
          autoComplete="off"
          inputMode="text"
        />
        <button type="submit" className="btn-premium-white w-full" style={{ display: 'block' }}>
          {t.accessSubmit}
        </button>
        {error && (
          <p className="text-[11px] font-sans text-red-300">{t.accessError}</p>
        )}
      </form>

      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/30">{t.or}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <a
        href="#registration"
        onClick={onScrollToRegistration}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a962] transition-colors hover:text-[#dab97c]"
      >
        {t.noCodeCta}
        <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  )
}

function FeaturedSlide({ watch, t }: { watch: FeaturedWatch; t: CopyT }) {
  const isAvailable = watch.status === 'available'
  const statusLabel = isAvailable ? t.statusAvailable : t.statusReserved

  return (
    <div className="grid items-stretch gap-0 lg:grid-cols-12">
      <div className="relative lg:col-span-7">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f1e7d3] sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
          <Image
            src={watch.image}
            alt={`${watch.brand} ${watch.model}`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#3a2a1c]/15 via-transparent to-[#c9a962]/10" />

          <div className="absolute left-0 top-0 z-10 bg-[#1f1813] px-4 py-2">
            <span
              className={cn(
                'flex items-center gap-2 font-sans text-[9px] font-bold uppercase tracking-[0.4em]',
                isAvailable ? 'text-[#c9a962]' : 'text-white/45'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isAvailable ? 'bg-[#c9a962]' : 'bg-white/30'
                )}
              />
              {statusLabel}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-6 border border-[#c9a962]/15" />
        </div>
      </div>

      <div className="relative flex flex-col justify-center bg-[#fbf6ec] px-6 py-12 sm:px-10 sm:py-16 lg:col-span-5 lg:px-14 lg:py-20">
        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.5em] text-[#8a6a2c]">
          {watch.brand}
        </p>

        <h3 className="mt-4 font-serif text-3xl font-medium leading-[1.1] tracking-tight text-[#1f1813] sm:text-4xl lg:text-[2.75rem]">
          {watch.model}
        </h3>

        <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#3d2f24]/70">
          Ref. {watch.reference}
          <span className="mx-3 text-[#3d2f24]/30">·</span>
          {watch.year}
          <span className="mx-3 text-[#3d2f24]/30">·</span>
          {watch.condition}
        </p>

        <div className="mt-6 h-px w-12 bg-[#8a6a2c]/60" />

        <p className="mt-6 font-sans text-[15px] leading-relaxed text-[#3d2f24]/85 text-pretty">
          {watch.editorial}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#8a6a2c]/15 pt-8">
          <SpecRow icon={Cog} label={t.specMechanism} value={watch.specs.mechanism} />
          <SpecRow icon={Gauge} label={t.specDiameter} value={watch.specs.diameter} />
          <SpecRow icon={Layers} label={t.specMaterial} value={watch.specs.material} />
          <SpecRow icon={Box} label={t.specBoxPapers} value={watch.specs.boxPapers} />
        </dl>

        <div className="mt-10 flex items-end justify-between gap-6 border-t border-[#8a6a2c]/15 pt-8">
          <div className="flex items-center gap-3 text-[#3d2f24]/70">
            <ShieldCheck className="h-4 w-4 text-[#8a6a2c]" strokeWidth={1.5} />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]">
              {t.cert}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-sans font-bold uppercase tracking-[0.4em] text-[#3d2f24]/50">
              {t.priceLabel}
            </p>
            <p className="mt-1 font-serif text-base italic text-[#1f1813]">
              {watch.priceLabel}
            </p>
          </div>
        </div>

        <Magnetic className="mt-8 block w-full" strength={6}>
          <Link
            href="#registration"
            className="btn-sharp w-full text-center"
            style={{ display: 'block' }}
          >
            {t.askCta}
          </Link>
        </Magnetic>
        <p className="mt-3 text-center font-sans text-[10px] uppercase tracking-[0.3em] text-[#3d2f24]/50">
          {t.response}
        </p>
      </div>
    </div>
  )
}

function SpecRow({ icon: Icon, label, value }: { icon: typeof Cog; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-[#8a6a2c]" strokeWidth={1.5} />
      <div>
        <dt className="font-sans text-[9px] font-bold uppercase tracking-[0.35em] text-[#3d2f24]/55">
          {label}
        </dt>
        <dd className="mt-1 font-serif text-sm text-[#1f1813]">{value}</dd>
      </div>
    </div>
  )
}
