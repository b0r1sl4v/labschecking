import { getFileContent, getHTMLTags } from './helpers';

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

const htmlContent = getFileContent('index.html');

getHTMLTags(tags, htmlContent);
