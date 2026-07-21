---
name: seo-orphan-landings-fix
description: Current internal-linking design that keeps every indexable landing reachable
metadata:
  type: project
  updated: 2026-07-21
---

Audit 2026-07-20/21 confirmed that 12 sitemap pages had no incoming HTML links and 204 mock-build URLs were unreachable from the Polish homepage. The language switcher was a client-side `<select>` using `router.push`, so PL/EN/UA were separate crawl silos.

Resolved on `codex/seo-indexation-foundations`:

- the language switcher is a native `<details>` containing real Next `<Link>` anchors for PL/EN/UA;
- the global footer hub includes chronographs, central-Warsaw buying, brand-specific on-request pages, authentication and about-us;
- contextual landing links always reserve space for authentication and about-us;
- a build crawler fails on any orphan, disconnected locale root, URL unreachable from `/`, or depth greater than three.

Current mock-build invariant: 300 sitemap URLs, zero orphans, every URL reachable from `/` within at most three links. Do not add a public indexable route without placing it in a global/contextual hub and running `npm run verify`.

External follow-up remains: deploy, resubmit sitemap in GSC, inspect representative URLs and monitor crawl/index coverage.
