import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';
import {
  CommonStyleProps,
  getCommonStyles,
  getSelectorStyles,
  SelectorStyleProps,
} from './helpers/styles';

const styles = getFileContent('css/style.css');

console.log('\nПроверка Flexbox свойств:');
const flexStyleProps: CommonStyleProps = [
  { rule: /display/, definition: /flex/, errorText: 'Нет display: flex' },
  { rule: /justify-content/ },
  { rule: /align-items/ },
  { rule: /flex-direction/ },
  { rule: /flex-wrap/ },
  { rule: /flex-grow/ },
  { rule: /flex-shrink/ },
  { rule: /flex-basis/ },
  { rule: /flex/ },
  { rule: /gap/ },
];

const { oneFound: flexUsed } = getCommonStyles(flexStyleProps, styles);

if (flexUsed) {
  sendSuccess('Flexbox используется');
} else {
  sendError('Свойства Flexbox не найдены');
}

console.log('\nПроверка относительных единиц измерения:');
const relativeUnits = /(em|rem|%|vw|vh)/;
const sizeStyleProps: CommonStyleProps = [
  { rule: /width/, definition: relativeUnits },
  { rule: /height/, definition: relativeUnits },
  { rule: /max-width/, definition: relativeUnits },
  { rule: /min-width/, definition: relativeUnits },
];

const { oneFound: relativeUsed } = getCommonStyles(sizeStyleProps, styles);

if (relativeUsed) {
  sendSuccess('Используются относительные единицы измерения');
} else {
  sendWarning('Не найдены относительные единицы измерения');
}

console.log('\nПроверка margin auto:');
const marginAutoProps: CommonStyleProps = [
  { rule: /margin-left/, definition: /auto/ },
  { rule: /margin-right/, definition: /auto/ },
];

const { oneFound: marginAutoUsed } = getCommonStyles(marginAutoProps, styles);

if (marginAutoUsed) {
  sendSuccess('Используется margin-left/right: auto');
} else {
  sendWarning('margin-left/right: auto не используется');
}

console.log('\nПроверка класса .sr-only:');
const srOnlyStyleProps: SelectorStyleProps = {
  '.sr-only': [
    { rule: /position/, definition: /absolute/ },
    { rule: /width/, definition: /1px/ },
    { rule: /^height/, definition: /1px/ },
    { rule: /margin/, definition: /-1px/ },
    { rule: /padding/, definition: /0/ },
    { rule: /border/, definition: /0/ },
    { rule: /overflow/, definition: /hidden/ },
    { rule: /clip/, definition: /rect\(0 0 0 0\)/ },
    { rule: /white-space/, definition: /nowrap/ },
    { rule: /clip-path/, definition: /inset\(100%\)/ },
  ],
};

const srOnlyStylesFound = getSelectorStyles(srOnlyStyleProps, styles);

if (srOnlyStylesFound) {
  sendSuccess('Класс .sr-only корректно оформлен');
} else {
  sendError('Класс .sr-only отсутствует или оформлен неверно');
}
