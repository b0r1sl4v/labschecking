import { getFileContent, sendError, sendSuccess } from './helpers/common';
import { getHTMLTags } from './helpers/markup';
import { CommonStyleProps, getCommonStyles } from './helpers/styles';

console.log('\nПроверка существования файла grid.html:');
const gridContent = getFileContent('grid.html');

console.log('\nПроверка ссылки на grid.html в футере:');
const htmlContent = getFileContent('index.html');
const linkTags = ['footer a'];
const footerLinks = getHTMLTags(linkTags, htmlContent)['footer a'];

let hasGridLink = false;
if (footerLinks) {
  for (const link of footerLinks) {
    if (link.getAttribute('href')?.includes('grid.html')) {
      hasGridLink = true;
    }
  }
}

if (hasGridLink) {
  sendSuccess('В футере есть ссылка на grid.html');
} else {
  sendError('В футере нет ссылки на grid.html');
}

console.log(
  '\nПроверка существования тегов header, main и footer в grid.html:',
);
const tags = ['header', 'main', 'footer'];

getHTMLTags(tags, gridContent);

console.log('\nПроверка свойств grid');

const styles = getFileContent('css/style.css');

const gridStyleProps: CommonStyleProps = [
  { rule: /display/, definition: /grid/, errorText: 'Нет display: grid' },
  { rule: /grid-template$/ },
  { rule: /grid-template-rows/ },
  { rule: /grid-template-columns/ },
  { rule: /grid-row/ },
  { rule: /grid-column/ },
  { rule: /grid-template-areas/ },
  { rule: /align-items/ },
  { rule: /justify-items/ },
  { rule: /gap/ },
];

const { oneFound: gridUsed } = getCommonStyles(gridStyleProps, styles);

if (gridUsed) {
  sendSuccess('Свойства grid используются');
} else {
  sendError('Свойства grid НЕ используются');
}

console.log('\nПроверка наличия правил, соответствующих шаблону RAM');

const ramStyleProps: CommonStyleProps = [
  {
    rule: /grid-template-.+/,
    definition: /repeat\(auto-fit\,\s*minmax/,
  },
];

const { oneFound: ramUsed } = getCommonStyles(ramStyleProps, styles);

if (ramUsed) {
  sendSuccess('Есть правила, соответствующие шаблону RAM');
} else {
  sendError('Шаблон RAM не реализован');
}
