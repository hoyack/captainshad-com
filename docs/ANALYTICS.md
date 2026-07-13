# Analytics plan

No analytics service is active in source. Activation requires CTO privacy/security review and a matching privacy-policy update.

## North-star and events

North-star: useful-reader conversion, measured as confirmed subscriptions per unique engaged visitor.

Planned events:

- `header_subscribe`, `hero_subscribe`: CTA clicks
- `field_notes_submit`: successful field-notes submission (server/platform truth)
- `speaking_inquiry_submit`: successful inquiry (server/platform truth)
- `manual_view`, `dispatch_view`: content engagement
- `outbound_guide`, `outbound_affiliate`: future, with campaign and disclosure context

Required properties: path, referrer class, campaign (`utm_source`, `utm_medium`, `utm_campaign`), viewport class, and offer. Never send form contents, email addresses, or message text to analytics.

## Dashboard

Weekly: landing pages, content → subscribe rate, form starts/completions, spam rejection, qualified inquiries, and unsubscribes. Monthly: cohort retention, source quality, revenue by mechanism, stale-page count, and corrections.

## Consent and retention

Prefer a privacy-respecting, cookieless configuration. If tracking changes legal/consent requirements, block activation until the policy and consent flow are updated. Document provider, retention, access, and deletion procedure before production.
