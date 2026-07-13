import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'artifacts', 'playwright-report', 'test-results']);
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
assert.equal(pages.length, 11, 'expected 11 complete HTML routes');
const broken = [];
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(root, file);
  assert.match(html, /<title>[^<]+<\/title>/, `${rel}: title`);
  assert.match(html, /<meta name="description" content="[^"]+">/, `${rel}: description`);
  assert.match(html, /<link rel="canonical" href="https:\/\/captainshad\.com\//, `${rel}: canonical`);
  assert.match(html, /<meta property="og:image" content="https:\/\/captainshad\.com\/assets\/og-card\.png">/, `${rel}: raster social card`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${rel}: one h1`);
  assert.match(html, /© <span data-year>2026<\/span> Hoyack\. All rights reserved\./, `${rel}: Hoyack footer`);
  assert.match(html, /Field-tested principles, not invented war stories or guaranteed outcomes\./, `${rel}: editorial boundary`);
  assert.doesNotMatch(html, /esoteric\.supply|Esoteric Supply|symbolic object/i, `${rel}: stale template copy`);
  assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)/, `${rel}: no inline scripts`);
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

const home = await readFile(path.join(root, 'index.html'), 'utf8');
assert.match(home, /<title>Captain Shad's Field Manual \| Leadership Notes<\/title>/);
assert.match(home, /<h1>Field notes for people who make the call<\/h1>/);
assert.match(home, /Get the field notes/);
assert.match(home, /\/speaking\/\?utm_source=captainshad/);

for (const [route, name, offer] of [
  ['subscribe', 'field-notes', 'field-notes'],
  ['speaking', 'speaking-inquiry', 'speaking-consulting'],
]) {
  const html = await readFile(path.join(root, route, 'index.html'), 'utf8');
  assert.match(html, new RegExp(`<form[^>]+name="${name}"[^>]+method="POST"[^>]+data-netlify="true"[^>]+netlify-honeypot="company-website"`), `${route}: Netlify form`);
  assert.match(html, new RegExp(`name="form-name" value="${name}"`), `${route}: form-name`);
  assert.match(html, /name="company-website"/, `${route}: honeypot field`);
  assert.match(html, /name="source" value="captainshad"/, `${route}: source`);
  assert.match(html, new RegExp(`name="offer" value="${offer}"`), `${route}: offer`);
  assert.match(html, /action="\/subscribe\/thanks\/"/, `${route}: success action`);
}
const thanks = await readFile(path.join(root, 'subscribe', 'thanks', 'index.html'), 'utf8');
assert.match(thanks, /<meta name="robots" content="noindex,follow">/);

const png = await readFile(path.join(root, 'assets', 'og-card.png'));
assert.equal(png.toString('ascii', 1, 4), 'PNG');
assert.equal(png.readUInt32BE(16), 1200, 'OG width');
assert.equal(png.readUInt32BE(20), 630, 'OG height');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const route of ['/', '/manual/', '/dispatches/', '/subscribe/', '/speaking/', '/about/', '/privacy/', '/terms/', '/disclosure/', '/corrections/']) {
  assert.ok(sitemap.includes(`https://captainshad.com${route}`), `sitemap ${route}`);
}
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /Sitemap: https:\/\/captainshad\.com\/sitemap\.xml/);

console.log(`Static checks passed for ${pages.length} routes, local links, SEO, forms, disclosures, and assets.`);
