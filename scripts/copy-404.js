import { existsSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const docs = resolve(import.meta.dirname, '..', 'docs', 'index.html');
const dest = resolve(import.meta.dirname, '..', 'docs', '404.html');
if (existsSync(docs)) {
  copyFileSync(docs, dest);
  console.log('Copied index.html to 404.html');
} else {
  console.error('Build output not found. Run npm run build first.');
  process.exit(1);
}