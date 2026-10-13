# Production deployment

## Required gates

1. CMO content gate: confirm positioning, claims, disclosures, and every CTA.
2. CTO security/QA gate: `npm ci && npm run test:all`, review CSP/headers, and inspect screenshots.
3. Merge the approved PR to `main`.

## Preserve DNS and mail

Before cutover, record public DNS:

```bash
for type in A AAAA CNAME MX TXT; do dig +short captainshad.com "$type"; done
```

Do not alter MX, TXT, SPF, DKIM, or DMARC while replacing the web root. The observed pre-change mail routes were IONOS MX hosts; re-query immediately before deployment because DNS is live state.

## Web-root cutover

1. Archive the current production web root with a UTC timestamp.
2. Upload the contents of `dist/` only. Build it with `npm run build`; the allowlist excludes `.git`, `node_modules`, tests, internal docs, package metadata, and source-only scripts.
3. Apply the security headers in `netlify.toml` (or their nginx/Apache equivalent).
4. Configure unknown paths to serve `404.html` with HTTP 404, never a 200 soft fallback.
5. Verify `https://captainshad.com/` and all sitemap routes return 200.
6. Verify a random unknown path returns 404.
7. Re-query MX and TXT records and compare to the pre-change capture.

## Rollback

Restore the timestamped previous web-root archive. DNS should not need rollback because this release changes web content only.
