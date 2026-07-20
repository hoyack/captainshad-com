import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const publicPaths = [
  'index.html',
  '404.html',
  'about',
  'assets',
  'corrections',
  'deployment-checklist',
  'disclosure',
  'downloads',
  'incident-starter-kit',
  'monitoring-basics',
  'postmortem-guide',
  'privacy',
  'robots.txt',
  'scripts/main.js',
  'service-handoff-checklist',
  'sitemap.xml',
  'styles',
  'terms',
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const item of publicPaths) {
  const source = path.join(root, item);
  const destination = path.join(out, item);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}
console.log(`Built ${publicPaths.length} public paths in ${out}`);
