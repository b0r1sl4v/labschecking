import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';
import { getHTMLTags } from './helpers/markup';
import {
  CommonStyleProps,
  getCommonStyles,
  getSelectorStyles,
  SelectorStyleProps,
} from './helpers/styles';

const htmlContent = getFileContent('index.html');
const cssContent = getFileContent('css/style.css');

console.log('\nПроверка языка страницы:');
const htmlTag = getHTMLTags(['html'], htmlContent)['html']?.[0];
const langAttr = htmlTag?.getAttribute('lang');
if (langAttr && langAttr.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
  sendSuccess(`Атрибут lang корректный: ${langAttr}`);
} else {
  sendError('Атрибут lang отсутствует или указан некорректно');
}

console.log('\nПроверка структуры заголовков:');
const headings = getHTMLTags(['h1', 'h2', 'h3'], htmlContent);
if (headings['h1']?.length) {
  sendSuccess('Присутствует заголовок h1');
} else {
  sendError('Отсутствует заголовок h1');
}

console.log('\nПроверка структуры сайта через landmarks:');
const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside'];
const landmarks = getHTMLTags(landmarkTags, htmlContent);
let foundCount = 0;
landmarkTags.forEach((tag) => {
  if (landmarks[tag]?.length) {
    foundCount++;
  }
});
if (foundCount >= 3) {
  sendSuccess('Основные landmarks теги присутствуют');
} else {
  sendWarning('Найдены не все теги landmark');
}

console.log('\nПроверка alt у изображений:');
const images = getHTMLTags(['img'], htmlContent)['img'] || [];
let hasBadAlt = false;
images.forEach((img) => {
  const alt = img.getAttribute('alt');
  if (alt === null) {
    hasBadAlt = true;
  }
});
if (!hasBadAlt) {
  sendSuccess('У всех изображений есть атрибут alt (возможно, пустой)');
} else {
  sendError('Некоторые изображения не имеют атрибута alt');
}

console.log('\nПроверка класса .sr-only:');
const srOnlyStyle: SelectorStyleProps = {
  '.sr-only': [
    { rule: /position/, definition: /absolute/ },
    { rule: /^width/, definition: /1px/ },
    { rule: /^height/, definition: /1px/ },
    { rule: /margin/, definition: /-1px/ },
    { rule: /padding/, definition: /0/ },
    { rule: /border/, definition: /0/ },
    { rule: /overflow/, definition: /hidden/ },
    { rule: /clip/, definition: /rect\(0 0 0 0\)/ },
    { rule: /white-space/, definition: /nowrap/ },
  ],
};
const hasSrOnly = getSelectorStyles(srOnlyStyle, cssContent);
if (hasSrOnly) {
  sendSuccess('Класс .sr-only реализован корректно');
} else {
  sendError('Класс .sr-only не реализован или оформлен неверно');
}

console.log('\nПроверка skip link:');
const skipLinks = getHTMLTags(['a'], htmlContent)['a']?.filter(
  (link) =>
    link.classList.contains('sr-only') &&
    link.getAttribute('href')?.startsWith('#'),
);
if (skipLinks?.length) {
  sendSuccess('Skip link присутствует');
} else {
  sendWarning('Skip link отсутствует или неправильно оформлен');
}

console.log('\nПроверка единиц измерения font-size:');
const fontSizeProps: CommonStyleProps = [
  {
    rule: /font\-size/,
    definition: /^(\d|\.)+(?!.*rem).*$/,
  },
];
const { oneFound: hasFontSizeStyle } = getCommonStyles(
  fontSizeProps,
  cssContent,
);
if (!hasFontSizeStyle) {
  sendSuccess('Используются rem для font-size');
} else {
  sendWarning('font-size указан не в rem');
}

console.log('\nПроверка выделения элементов в фокусе:');
const focusStyle: SelectorStyleProps = {
  ':focus': [{ rule: /font/ }, { rule: /border/ }],
};
const hasFocusStyle = getSelectorStyles(focusStyle, cssContent);
if (hasFocusStyle) {
  sendSuccess('Элементы имеют стили фокуса');
} else {
  sendWarning('Стили фокуса могут отсутствовать');
}

console.log('\nПроверка связки label и input:');
const { label: labels, input: inputs } = getHTMLTags(
  ['label', 'input'],
  htmlContent,
);
let labelLinked = true;
if (!labels?.length || !inputs?.length) {
  labelLinked = false;
} else {
  for (const label of labels) {
    const forAttr = label.getAttribute('for');
    if (!forAttr) {
      if (label.innerHTML.includes('<input')) continue;
      labelLinked = false;
      break;
    }
    let hasInputWithId = false;
    for (const input of inputs) {
      if (input.getAttribute('id') === forAttr) {
        hasInputWithId = true;
      }
    }
    if (!hasInputWithId) {
      labelLinked = false;
      break;
    }
  }
}
if (labelLinked) {
  sendSuccess('Все label связаны с input');
} else {
  sendError('Некоторые label не связаны с полями ввода');
}
