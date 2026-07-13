# QA evidence

This file is updated only with results actually produced from the feature branch.

## Automated checks

Run:

```bash
npm ci
npm run test:all
npm audit --audit-level=moderate
```

The static suite checks route inventory, titles/descriptions/canonicals/social card, one H1, Hoyack footer, editorial boundary, local links, form plumbing, sitemap/robots, asset dimensions, and absence of stale template copy. Playwright checks all routes at desktop and mobile, mobile menu behavior, form controls, horizontal overflow, and console/page errors.

## Verified branch results

- `npm run test:all`: **PASS** — HTML validation; static checks for 11 routes, local links, SEO, forms, disclosures, and assets; Playwright checks for all 11 routes at 1440×900 and 390×844, mobile menu, both forms, horizontal overflow, and zero console/page errors.
- `npm audit --audit-level=moderate`: **PASS**, 0 known vulnerabilities.
- Social card: verified PNG, 1200×630.
- Screenshots: `home-desktop.png` 1440×2885; `home-mobile.png` 390×4410. Visual review found no clipping, overlap, overflow, or broken responsive sections.

## Visual evidence

- `docs/screenshots/home-desktop.png`
- `docs/screenshots/home-mobile.png`

## Production caveat

Local and generic static-preview checks cannot prove Netlify form detection, notification delivery, production analytics, DNS preservation, HTTPS, monitoring, or rollback. Those are CTO-owned deployment gates and must be evidenced separately.
