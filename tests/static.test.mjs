import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist', 'playwright-report', 'test-results']);
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = await walk(root);
assert.equal(pages.length, 12, 'expected 11 public routes plus a 404 page');
const broken = [];
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(root, file);
  assert.match(html, /<title>[^<]+<\/title>/, `${rel}: title`);
  assert.match(html, /<meta name="description" content="[^"]+">/, `${rel}: description`);
  assert.match(html, /<link rel="canonical" href="https:\/\/captainshad\.com\//, `${rel}: canonical`);
  assert.match(html, /<meta property="og:title" content="[^"]+">/, `${rel}: OG title`);
  assert.match(html, /<meta property="og:description" content="[^"]+">/, `${rel}: OG description`);
  assert.match(html, /<meta property="og:image" content="https:\/\/captainshad\.com\/assets\/og-card\.png">/, `${rel}: raster social card`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${rel}: one h1`);
  assert.match(html, /© 2026 Hoyack\. All rights reserved\./, `${rel}: Hoyack footer`);
  assert.match(html, /Practical starting points, not guaranteed outcomes/, `${rel}: editorial boundary`);
  assert.doesNotMatch(html, /Captain Shad|Field Manual|adventure-tested|war stories/, `${rel}: stale concept copy`);
  assert.doesNotMatch(html, /<form[ >]/, `${rel}: no dead forms`);
  assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)/, `${rel}: no inline scripts`);
  assert.doesNotMatch(html, /plausible\.io|googletagmanager|gtag\(/i, `${rel}: no active analytics`);
  for (const mail of html.matchAll(/href="(mailto:[^"]+)"/g)) {
    assert.ok(mail[1].startsWith('mailto:hello@hoyack.com'), `${rel}: mailto routes to the approved Hoyack inbox`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1].split('#')[0].split('?')[0];
    if (!url || /^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const target = url.startsWith('/') ? path.join(root, url) : path.resolve(path.dirname(file), url);
    let candidate = target;
    try {
      if ((await stat(target)).isDirectory()) candidate = path.join(target, 'index.html');
      await stat(candidate);
    } catch {
      broken.push(`${rel}: ${match[1]}`);
    }
  }
}
assert.deepEqual(broken, [], `broken local links:\n${broken.join('\n')}`);

const required = [
  ['index.html', /Keep the service alive\. Leave the drama out\./],
  ['incident-starter-kit/index.html', /The first 15 minutes, under control/],
  ['service-handoff-checklist/index.html', /Hand off the service, not the mystery/],
  ['deployment-checklist/index.html', /Deploy with a stop condition/],
  ['postmortem-guide/index.html', /Write the system change, not the courtroom transcript/],
  ['monitoring-basics/index.html', /Monitor the user journey before the server trivia/],
];
for (const [rel, pattern] of required) {
  assert.match(await readFile(path.join(root, rel), 'utf8'), pattern, `${rel}: required starter content`);
}

const home = await readFile(path.join(root, 'index.html'), 'utf8');
assert.match(home, /Get the Incident Starter Kit/);
assert.match(home, /mailto:hello@hoyack\.com\?subject=Service%20rescue%20review/);
assert.match(home, /https:\/\/hoyack\.com\//);

const kit = await readFile(path.join(root, 'downloads', 'incident-starter-kit.md'), 'utf8');
for (const phrase of ['First 15 minutes', 'Incident log', 'Status update', 'Recovery gate']) {
  assert.ok(kit.includes(phrase), `download includes ${phrase}`);
}

const notFound = await readFile(path.join(root, '404.html'), 'utf8');
assert.match(notFound, /<meta name="robots" content="noindex,follow">/);
for (const match of notFound.matchAll(/(?:href|src)="([^"]+)"/g)) {
  const url = match[1];
  if (/^(https?:|mailto:|#)/.test(url)) continue;
  assert.ok(url.startsWith('/'), `404 reference is root-relative: ${url}`);
}
const png = await readFile(path.join(root, 'assets', 'og-card.png'));
assert.equal(png.toString('ascii', 1, 4), 'PNG');
assert.equal(png.readUInt32BE(16), 1200, 'OG width');
assert.equal(png.readUInt32BE(20), 630, 'OG height');

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const route of ['/', '/incident-starter-kit/', '/service-handoff-checklist/', '/deployment-checklist/', '/postmortem-guide/', '/monitoring-basics/', '/about/', '/privacy/', '/terms/', '/disclosure/', '/corrections/']) {
  assert.ok(sitemap.includes(`https://captainshad.com${route}`), `sitemap ${route}`);
}
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/captainshad\.com\/sitemap\.xml/);
const netlify = await readFile(path.join(root, 'netlify.toml'), 'utf8');
for (const directive of ["default-src 'self'", "frame-ancestors 'none'", "object-src 'none'", 'status = 404']) {
  assert.ok(netlify.includes(directive), `netlify includes ${directive}`);
}

console.log(`Static checks passed for ${pages.length} pages, starter content, links, SEO, policies, download, 404, and original social asset.`);
