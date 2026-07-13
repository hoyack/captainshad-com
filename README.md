# Captain Shad’s Field Manual

Production-ready static MVP for [captainshad.com](https://captainshad.com): original leadership field notes, decision frameworks, an email conversion path, and a speaking/consulting inquiry path.

## Positioning

Practical judgment for people accountable for the outcome. The site rejects invented expedition lore, fake authority, and generic leadership theater. See `docs/CONCEPT.md` and `docs/CRO.md`.

## Routes

- `/` — publication front door
- `/manual/` — five decision and team-operating frameworks
- `/dispatches/` — three original field notes
- `/subscribe/` — spam-protected Netlify field-notes form
- `/speaking/` — spam-protected speaking/consulting inquiry
- `/about/`, `/privacy/`, `/terms/`, `/disclosure/`, `/corrections/`

## Local development

```bash
npm ci
npm run serve
# open http://localhost:4173
```

## Verification

```bash
npm run test:all
npm audit --audit-level=moderate
```

The suite validates all HTML, local links, SEO metadata, claims/disclosures, form plumbing, desktop/mobile routes, mobile navigation, screenshots, and console errors.

## Deployment

Netlify publishes the repository root with no build command. Forms require a Netlify deploy, form detection, notification routing, and a real delivery test. CTO owns PR approval/merge, DNS, HTTPS, production form proof, monitoring, and rollback. See `docs/DEPLOYMENT.md`.

No secrets are committed. `.env.example` contains names only.
