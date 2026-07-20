import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const expectedTopLevel = [
  '404.html', 'about', 'assets', 'corrections', 'deployment-checklist',
  'disclosure', 'downloads', 'incident-starter-kit', 'index.html',
  'monitoring-basics', 'postmortem-guide', 'privacy', 'robots.txt',
  'scripts', 'service-handoff-checklist', 'sitemap.xml', 'styles', 'terms',
].sort();
const actualTopLevel = (await readdir(dist)).sort();
assert.deepEqual(actualTopLevel, expectedTopLevel, 'dist contains only the public allowlist');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

const files = await walk(dist);
assert.equal(files.filter(file => file.endsWith('.html')).length, 12, 'dist has all HTML pages');
for (const forbidden of ['README.md', 'package.json', 'netlify.toml', 'tests', 'docs', '.git', '.env.example', 'generate-assets.py', 'build.mjs']) {
  assert.ok(!files.some(file => file.includes(forbidden)), `dist excludes ${forbidden}`);
}
for (const required of ['assets/og-card.png', 'downloads/incident-starter-kit.md', 'scripts/main.js', 'styles/main.css']) {
  await stat(path.join(dist, required));
}
const home = await readFile(path.join(dist, 'index.html'), 'utf8');
assert.match(home, /Small Crew Runbooks/);
assert.doesNotMatch(home, /Captain Shad|Field Manual/);
console.log(`Publish-directory checks passed for ${files.length} allowlisted files.`);
