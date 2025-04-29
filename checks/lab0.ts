import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { findHTMLTags, checkFileExists } from './helpers';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filepath = resolve(__dirname, '..', 'index.html');

checkFileExists(filepath);

const tags = [
  'header',
  'nav',
  'main',
  'footer',
  'h1',
  'h2',
  'p',
  'a',
  'img',
  'ul',
  'ol',
  'li',
];

let htmlContent;
try {
  htmlContent = readFileSync(filepath, 'utf-8');
} catch (error) {
  console.error(error);
  process.exit(1);
}

findHTMLTags(tags, htmlContent);
