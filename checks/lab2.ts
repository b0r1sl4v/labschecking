import {
  getHTMLTags,
  getFileContent,
  sendError,
  SelectorStyleProps,
  CommonStyleProps,
  getSelectorStyles,
  sendSuccess,
} from './helpers';

const htmlContent = getFileContent('index.html');

const tags = ['link'];
const linkContent = getHTMLTags(tags, htmlContent)['link'];

if (!linkContent?.length) {
  process.exit(1);
}

const stylesFiles = linkContent.map((linkTag) => linkTag.getAttribute('href'));

console.log(stylesFiles);

const existingStylesFiles = stylesFiles.reduce(
  (acc, filename) =>
    filename ? { ...acc, [filename.split('/').pop() ?? '']: filename } : acc,
  {},
);

const hasNormalize = existingStylesFiles['normalize.css'];
const hasReseter = existingStylesFiles['reseter.css'];

if (!hasNormalize && !hasReseter) {
  sendError('Нужно добавить или normalize.css, или reseter.css');
}
if (hasNormalize && hasReseter) {
  sendError('normalize.css и reseter.css не могут существовать одновременно');
}

if (!existingStylesFiles['style.css']) {
  sendError('style.css отсутствует');
  process.exit();
}

const styles = getFileContent(existingStylesFiles['style.css']);

const selectorStyleProps: SelectorStyleProps = {
  ':root': [
    {
      rule: RegExp('^--.*$'),
      errorText: 'В :root нет объявленных переменных',
    },
    {
      rule: RegExp('^font-size$'),
      errorText: 'В :root нет font-size',
    },
  ],
};

const selectorStylesFound = getSelectorStyles(selectorStyleProps, styles);

const commonStyleProps: CommonStyleProps = [
  {
    rule: RegExp('font-weight'),
  },
  {
    rule: RegExp('line-height'),
  },
  {
    rule: RegExp('text-align'),
  },
  {
    rule: RegExp('color'),
    definition: RegExp('var(.*)'),
    errorText: 'Переменные не использованы',
  },
  {
    rule: RegExp('background-color'),
  },
  {
    rule: RegExp('border'),
  },
  {
    rule: RegExp('border-radius'),
  },
];

if (selectorStylesFound) {
  sendSuccess('Все стили найдены');
}
