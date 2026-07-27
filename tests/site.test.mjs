import assert from 'node:assert/strict';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const routes = ['/', '/incident-starter-kit/', '/service-handoff-checklist/', '/deployment-checklist/', '/postmortem-guide/', '/monitoring-basics/', '/about/', '/privacy/', '/terms/', '/disclosure/', '/corrections/'];
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
let server;
let base = process.env.BASE_URL;
if (!base) {
  const root = path.resolve(process.env.SITE_ROOT || path.join(process.cwd(), 'dist'));
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
      const body = await readFile(path.join(root, '404.html'));
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(body);
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
      assert.ok((await page.title()).includes('Small Crew Runbooks'), `${route} branded title`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${route} horizontal overflow ${overflow}px at ${viewport.width}`);
    }
    assert.deepEqual(errors, [], `console errors ${viewport.width}: ${errors.join('; ')}`);

    await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `docs/screenshots/home-${viewport.label}.png`, fullPage: true });
    if (viewport.width < 500) {
      const navToggle = page.locator('[data-nav-toggle]');
      assert.ok((await navToggle.boundingBox()).height >= 44, 'mobile menu target at least 44px');
      await navToggle.click();
      assert.equal(await navToggle.getAttribute('aria-expanded'), 'true');
      assert.ok((await page.locator('[data-nav-menu]').getAttribute('class')).includes('open'));
      await page.keyboard.press('Escape');
      assert.equal(await navToggle.getAttribute('aria-expanded'), 'false');
    }
    await page.close();
  }

  const incident = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await incident.goto(`${base}/incident-starter-kit/`, { waitUntil: 'networkidle' });
  await incident.screenshot({ path: 'docs/screenshots/incident-desktop.png', fullPage: true });
  const kitResponse = await incident.request.get(`${base}/downloads/incident-starter-kit.md`);
  assert.equal(kitResponse.status(), 200, 'starter kit download 200');
  assert.match(await kitResponse.text(), /## First 15 minutes/);
  await incident.close();

  const missing = await browser.newPage();
  const failedSubresources = [];
  missing.on('response', response => {
    if (response.status() >= 400 && response.request().resourceType() !== 'document') failedSubresources.push(`${response.status()} ${response.url()}`);
  });
  const missingResponse = await missing.goto(`${base}/definitely-not-a-real-runbook-7f42/nested/`, { waitUntil: 'networkidle' });
  assert.equal(missingResponse.status(), 404, 'nested unknown route is a real 404');
  assert.equal(await missing.locator('h1').textContent(), 'This page is not in the runbook');
  assert.equal(await missing.locator('link[rel="stylesheet"]').getAttribute('href'), '/styles/main.css', '404 stylesheet is root-relative');
  assert.equal(await missing.locator('a.brand').getAttribute('href'), '/', '404 home link is root-relative');
  assert.equal(await missing.locator('.button-primary').getAttribute('href'), '/incident-starter-kit/', '404 recovery link is root-relative');
  assert.equal(await missing.locator('.site-header').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(24, 28, 25)', '404 stylesheet loaded');
  assert.deepEqual(failedSubresources, [], `nested 404 subresource failures: ${failedSubresources.join('; ')}`);
  await missing.close();
} finally {
  await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
console.log(`Verified ${routes.length} routes at desktop/mobile, menu, download, 404, overflow, screenshots, and zero console errors.`);
