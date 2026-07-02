---
name: seo-orphan-landings-fix
description: Why brand/city SEO landing pages weren't ranking and the internal-linking + analytics fix applied
metadata:
  type: project
---

Audit 2026-07-02 (website_warszawskiczas). The `zegarki-*-warszawa` / brand landing pages exist, are in sitemap.xml, deployed, and technically correct — but were **orphan pages**: no link from header nav, footer, mobile menu, or homepage. Only cross-linked among themselves via `lib/related-links.ts` + sitemap. Google index (`site:` search) showed homepage/produkty/skup-zegarkow-warszawa but NOT the brand landings. Pages created 2026-05-11, site mid-migration from legacy PHP (old /index.php?display= URLs still indexed).

**Fix applied (working tree, typecheck green):** added `seoHubLinks()` to [[related-links]] and a pure `components/seo/seo-link-hub.tsx`; wired a site-wide link hub into the footer and an in-content hub on /produkty. Added GSC verification via `GOOGLE_SITE_VERIFICATION` env (meta tag in app/layout.tsx metadata) and GA4 scaffold `components/analytics.tsx` gated on `NEXT_PUBLIC_GA_ID`. Both env vars documented in .env.example. Both NEXT_PUBLIC/verification need a rebuild to take effect.

**Still needs the OWNER (can't be automated):** create Google Search Console account → verify (paste token to `GOOGLE_SITE_VERIFICATION` or DNS TXT) → submit sitemap → URL-inspect + Request indexing for landings. Create GA4 → set `NEXT_PUBLIC_GA_ID`. There is currently NO web analytics, so real per-page visit stats are unavailable until GA4/GSC exist. Head term "zegarki rolex warszawa" is long-term (needs backlinks + time); target long-tail first.

Related: [[cms-website-publish-boundary]].
