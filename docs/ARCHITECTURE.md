# Architecture

## Shape

A dependency-light static site: semantic HTML, one shared CSS file, one small progressive-enhancement script, original local assets, and Netlify-managed forms. There is no client framework, database, authentication, or committed credential.

## Hosting decision

Netlify is the requested static/edge-first target. `netlify.toml` publishes the repository root and sets CSP, frame denial, MIME-sniffing protection, referrer policy, permissions policy, and revalidating asset cache headers.

## Forms

Both forms include POST, `data-netlify="true"`, a hidden `form-name`, a named honeypot with matching field, explicit success action, source/offer attribution, labels, and consent. Form success and notifications must be verified on a Netlify deploy; a static preview cannot prove delivery.

## Security and privacy boundaries

- CSP allows same-origin scripts/styles/images/forms only.
- No third-party scripts or remote fonts.
- No inline script/style dependency.
- No secrets or private endpoints.
- Analytics is intentionally inactive pending approval.
- Form data is minimized and policy-linked.

## Performance and accessibility

System fonts, a small raster social card, one decorative SVG, no runtime bundles, responsive layout, skip link, semantic landmarks, keyboard focus, 48px controls, labeled forms, reduced-motion handling, and no essential animation.
