import assert from 'node:assert/strict';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const routes = ['/', '/manual/', '/dispatches/', '/about/', '/subscribe/', '/speaking/', '/privacy/', '/terms/', '/disclosure/', '/corrections/', '/subscribe/thanks/'];
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
let server;
let base = process.env.BASE_URL;
if (!base) {
  const root = process.cwd();
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let file = path.resolve(root, `.${pathname}`);
      if (!file.startsWith(`${root}${path.sep}`) && file !== root) throw new Error('invalid path');
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
}
base = base.replace(/\/$/, '');
await mkdir('docs/screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 900, label: 'desktop' }, { width: 390, height: 844, label: 'mobile' }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, `${route} 200`);
      assert.equal(await page.locator('h1').count(), 1, `${route} one h1`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${route} horizontal overflow ${overflow}px at ${viewport.width}`);
    }
    assert.deepEqual(errors, [], `console errors ${viewport.width}: ${errors.join('; ')}`);
    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `docs/screenshots/home-${viewport.label}.png`, fullPage: true });
    if (viewport.width < 500) {
      await page.locator('[data-nav-toggle]').click();
      assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'), 'true');
      assert.ok((await page.locator('[data-nav-menu]').getAttribute('class')).includes('open'));
    }
    await page.close();
  }

  const subscribe = await browser.newPage();
  await subscribe.goto(`${base}/subscribe/`);
  for (const id of ['name', 'email', 'role', 'privacy-consent']) assert.ok(await subscribe.locator(`#${id}`).count(), `missing ${id}`);
  assert.equal(await subscribe.locator('input[name="source"]').getAttribute('value'), 'captainshad');
  assert.equal(await subscribe.locator('input[name="offer"]').getAttribute('value'), 'field-notes');
  await subscribe.close();

  const inquiry = await browser.newPage();
  await inquiry.goto(`${base}/speaking/`);
  for (const id of ['contact-name', 'contact-email', 'organization', 'brief', 'inquiry-consent']) assert.ok(await inquiry.locator(`#${id}`).count(), `missing ${id}`);
  assert.equal(await inquiry.locator('input[name="offer"]').getAttribute('value'), 'speaking-consulting');
  await inquiry.close();
} finally {
  await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
console.log(`Verified ${routes.length} routes at desktop/mobile, menu, forms, overflow, and zero console errors.`);
