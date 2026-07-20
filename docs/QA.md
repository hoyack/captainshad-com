# QA evidence

Run `npm run test:all`. The suite builds the public allowlist into `dist/`, rejects leaked source/internal files, and drives Playwright against that exact publish directory. It captures:

- `docs/screenshots/home-desktop.png` at 1440 × 900
- `docs/screenshots/home-mobile.png` at 390 × 844
- `docs/screenshots/incident-desktop.png` at 1440 × 900

The committed screenshots are evidence for the exact tested commit. Re-run QA after any content or CSS change.

Manual review also checks: no stale Captain Shad copy, visible Hoyack relationship, working mailto and kit download CTAs, keyboard focus, print layout, no horizontal overflow, and readable signal states that do not rely on color alone.
