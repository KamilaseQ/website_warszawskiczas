---
name: cms-website-publish-boundary
description: How the CMS app publishes to the website and why code edits are never overwritten
metadata:
  type: project
---

Two repos: `website_warszawskiczas` (Next.js 15 server-mode, Hostinger) and sibling `app_warszawskiczas` (Cloudflare Workers CMS/CRM, D1). The CMS publishes to the website by committing **only** `from-cms/published-snapshot.json` via the GitHub Contents API (single-file PUT in `src/server/publish-trigger.ts`, path `GITHUB_PUBLISH_PATH`, default that file). It never touches page code, components, lib, config, or fixtures. Git history confirms: every `chore(cms): publish …` commit changes only that one marker file.

Live product data comes from the CMS API at build time (`CMS_MODE=live`, fetched by `from-cms/adapters/*`); fixtures json is mock-mode only. `from-cms/` is the only layer allowed to talk to the CMS (documented in app repo `documentation/FROM-CMS-BOUNDARY.md`).

Implication: hand-written edits to app/components/lib/SEO/layout are SAFE — the CMS only manages the watch list + leads and triggers rebuilds; it cannot revert or overwrite code. Related: [[seo-orphan-landings-fix]].
