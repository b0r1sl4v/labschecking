import {
  SelectorStyleProps,
  CommonStyleProps,
  getSelectorStyles,
  getCommonStyles,
} from './helpers/styles';
import { getFileContent, sendError, sendSuccess } from './helpers/common';
import { getHTMLTags } from './helpers/markup';

const htmlContent = getFileContent('index.html');

const tags = ['link'];
const linkContent = getHTMLTags(tags, htmlContent)['link'];

if (!linkContent?.length) {
  process.exit(1);
}

const stylesFiles = linkContent.map((linkTag) => linkTag.getAttribute('href'));

const existingStylesFiles = stylesFiles.reduce(
  (acc, filename) =>
    filename ? { ...acc, [filename.split('/').pop() ?? '']: filename } : acc,
  {},
);

const hasNormalize = existingStylesFiles['normalize.css'];
const hasReseter = existingStylesFiles['reseter.css'];

if (!hasNormalize && !hasReseter) {
  sendError('Не подключен ни normalize.css, ни reseter.css');
}
if (hasNormalize && hasReseter) {
  sendError(
    'normalize.css и reseter.css не могут быть подключены одновременно',
  );
}
if (!existingStylesFiles['style.css']) {
  sendError('style.css отсутствует');
  process.exit(1);
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

const { allFound: commonStylesFound } = getCommonStyles(
  commonStyleProps,
  styles,
);

if (selectorStylesFound && commonStylesFound) {
  sendSuccess('Все стили найдены');
}
