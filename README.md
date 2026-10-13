# Small Crew Runbooks

Small Crew Runbooks is the production source for [captainshad.com](https://captainshad.com): no-drama incident, deployment, monitoring, and service-handoff guides for small teams keeping real services alive.

## Run locally

```bash
npm ci
npm run serve
```

Open `http://localhost:4173/`.

## Full QA

```bash
npm run test:all
```

The suite validates HTML, local links, SEO metadata, legal/editorial boundaries, the downloadable starter kit, and the allowlisted `dist/` artifact. Playwright then exercises the actual publish directory across all primary routes at desktop and mobile widths, including the mobile menu, overflow, touch targets, a real 404, and browser console errors. It writes screenshots to `docs/screenshots/`.

## Production artifact

```bash
npm run build
```

This creates `dist/` from an explicit public allowlist. Internal docs, tests, package metadata, source-only scripts, and repository files are excluded. Netlify publishes `dist/`; direct-host deployments should upload `dist/` rather than the repository root.

## Editorial boundary

- No fictional captain, crew theater, military framing, testimonials, client logos, or invented field stories.
- Checklists are starting points, not a substitute for service-specific engineering or security review.
- Small Crew Runbooks is published by Hoyack. Commercial referrals and future sponsorships are disclosed.
- No client or confidential incident information belongs in examples.

## Deployment

See `docs/DEPLOYMENT.md`. The production cutover must preserve the existing captainshad.com DNS records, especially MX and TXT records, and retain a rollback copy of the prior web root.
