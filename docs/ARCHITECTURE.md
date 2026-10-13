# Architecture

Small Crew Runbooks is a dependency-free static site. Each route is a directory with an `index.html`; shared presentation and behavior live in `styles/main.css` and `scripts/main.js`.

## Runtime

- No application server, database, cookies, form handler, or runtime secrets.
- JavaScript is limited to the accessible mobile navigation menu.
- All site assets are local and covered by a restrictive Content Security Policy.
- Contact uses a mailto link so the site never ships a dead lead form.

## Routes

The public information architecture is the homepage, five operational runbooks, About, and four policy pages. `404.html` is branded and marked `noindex,follow`.
