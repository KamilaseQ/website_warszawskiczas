const baseUrl = argument('base-url', process.env.CHECK_BASE_URL || 'http://127.0.0.1:3000')

const catalogues = [
  {
    path: '/produkty',
    shellPhrase: 'Zegarki, biżuteria i akcesoria',
    breadcrumbName: 'Katalog',
  },
  {
    path: '/en/products',
    shellPhrase: 'Watches, jewellery and accessories',
    breadcrumbName: 'Catalogue',
  },
  {
    path: '/ua/каталог',
    shellPhrase: 'Годинники, прикраси та аксесуари',
    breadcrumbName: 'Каталог',
  },
]
const failures = []
let expectedCardCount = null
let expectedCollectionCount = null

for (const { path, shellPhrase, breadcrumbName } of catalogues) {
  const response = await fetch(new URL(path, baseUrl))
  if (!response.ok) {
    failures.push(`${path}: HTTP ${response.status}`)
    continue
  }

  const html = await response.text()
  const productCards = [
    ...html.matchAll(
      /<a\b[^>]*data-catalog-card=""[^>]*>[\s\S]*?<\/a>/gi,
    ),
  ].map((match) => match[0])
  const imageTags = productCards.flatMap((card) => [...card.matchAll(/<img\b[^>]*>/gi)])
    .map((match) => match[0])
  const highPriorityImages = imageTags.filter((tag) => /fetchPriority="high"/i.test(tag))
  const highPriorityCards = productCards.filter((card) => /fetchPriority="high"/i.test(card))
  const deferredCards = productCards.filter((card) =>
    /data-deferred-product-image="pending"/i.test(card),
  )
  const declaredCount = Number(
    html.match(/\bid="catalog-results"[^>]*\bdata-catalog-count="(\d+)"/i)?.[1] ?? -1,
  )
  const jsonLd = jsonLdDocuments(html, path, failures)
  const collection = jsonLd.find((document) => document?.['@type'] === 'CollectionPage')
  const breadcrumb = jsonLd.find((document) => document?.['@type'] === 'BreadcrumbList')
  const collectionItems = collection?.mainEntity?.itemListElement
  const collectionCount = collection?.mainEntity?.numberOfItems

  if (expectedCardCount === null) expectedCardCount = productCards.length
  if (expectedCollectionCount === null && Number.isInteger(collectionCount)) {
    expectedCollectionCount = collectionCount
  }
  if (productCards.length === 0) {
    failures.push(`${path}: rendered zero catalogue cards`)
  }
  if (declaredCount !== productCards.length) {
    failures.push(`${path}: rendered ${productCards.length}/${declaredCount} declared cards`)
  }
  if (!html.includes(shellPhrase)) {
    failures.push(`${path}: catalogue shell does not name all three product categories`)
  }
  if (!collection || !Array.isArray(collectionItems)) {
    failures.push(`${path}: missing CollectionPage ItemList JSON-LD`)
  } else {
    if (collectionCount !== collectionItems.length) {
      failures.push(
        `${path}: CollectionPage declares ${collectionCount}/${collectionItems.length} listed products`,
      )
    }
    if (collectionItems.length < productCards.length) {
      failures.push(`${path}: CollectionPage omits products rendered in the catalogue`)
    }
    if (
      expectedCollectionCount !== null &&
      collectionItems.length !== expectedCollectionCount
    ) {
      failures.push(
        `${path}: CollectionPage lists ${collectionItems.length}/${expectedCollectionCount} products`,
      )
    }
  }
  const lastBreadcrumb = breadcrumb?.itemListElement?.at?.(-1)
  if (lastBreadcrumb?.name !== breadcrumbName) {
    failures.push(`${path}: missing localized generic catalogue breadcrumb`)
  }
  if (productCards.length !== expectedCardCount) {
    failures.push(
      `${path}: rendered ${productCards.length}/${expectedCardCount} catalogue cards`,
    )
  }
  if (imageTags.length !== 1 || highPriorityImages.length !== 1) {
    failures.push(`${path}: expected exactly one high-priority catalogue image`)
  }
  if (deferredCards.length !== Math.max(0, productCards.length - 1)) {
    failures.push(`${path}: every catalogue card except the first must defer its image`)
  }
  if (
    deferredCards.some(
      (card) =>
        !/data-deferred-image-variant="thumb"/i.test(card) ||
        !/data-deferred-image-src="[^"]*-thumb\.webp/i.test(card),
    )
  ) {
    failures.push(`${path}: every deferred catalogue card must declare an explicit thumb asset`)
  }
  if (
    deferredCards.some(
      (card) => /<source\b/i.test(card) || /-medium\.webp/i.test(card),
    )
  ) {
    failures.push(
      `${path}: deferred catalogue cards must use one thumb without a medium srcset`,
    )
  }
  if (
    highPriorityCards.length !== 1 ||
    highPriorityCards.some(
      (card) => /<source\b/i.test(card) || /-medium\.webp/i.test(card) || !/-thumb\.webp/i.test(card),
    )
  ) {
    failures.push(`${path}: priority card must request one thumb, not a medium or picture srcset`)
  }
  if (/\?page=\d+#catalog-results/i.test(html) || /catalogue? pagination/i.test(html)) {
    failures.push(`${path}: classic pagination is still rendered`)
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`[catalog-audit] ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `[catalog-audit] OK: 3 locales, ${expectedCardCount} continuous-scroll cards, ` +
      'one priority thumb and all remaining images deferred thumb-only',
  )
}

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  return index >= 0 ? process.argv[index + 1] : fallback
}

function jsonLdDocuments(html, path, failures) {
  const documents = []
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      documents.push(JSON.parse(match[1]))
    } catch {
      failures.push(`${path}: invalid JSON-LD document`)
    }
  }
  return documents
}
