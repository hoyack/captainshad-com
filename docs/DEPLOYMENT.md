# Deployment, monitoring, and rollback

## Preview

Deploy the feature branch to a non-production Netlify deploy preview (preferred) or a temporary static preview. Preview forms can validate platform detection, but notification delivery must be tested in the approved Netlify site.

## Production runbook (CTO-owned)

1. Approve and merge the reviewed PR; record the merge commit.
2. Create/connect the Netlify site to `hoyack/captainshad-com`, publish directory `.` and no build command.
3. Confirm both `field-notes` and `speaking-inquiry` appear in Netlify Forms; configure approved notification/CRM routing and spam controls.
4. Submit one test for each form; prove receipt, attribution fields, consent, success route, and deletion path.
5. Snapshot all DNS first. `captainshad.com` uses Cloudflare nameservers; preserve every existing record, especially verification TXT records. Change only approved web records. Do not alter MX, SPF, DKIM, or DMARC.
6. Attach apex and `www`; wait for trusted HTTPS on both; choose one canonical redirect.
7. Verify headers, 404 behavior, canonical URLs, robots, sitemap, all 11 routes, desktop/mobile rendering, and zero console errors.
8. Activate approved analytics only after provider/privacy review.

## Monitoring

- Uptime: apex, `/manual/`, `/subscribe/`, `/speaking/` every 5 minutes.
- Daily: certificate and redirect check.
- Weekly: form delivery canary and broken-link scan.
- Monthly: dependency audit, policy/processor review, and content freshness dashboard.

Alert on non-2xx/3xx, certificate expiry under 21 days, wrong-host redirect, missing form, or canary delivery failure.

## Rollback

Use Netlify's previous immutable deploy to restore the last green package. If DNS changed, restore the timestamped pre-change snapshot without touching mail/verification records. Re-run route, TLS, form, and header checks; record incident cause and corrective action.
