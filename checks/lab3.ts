import {
  CommonStyleProps,
  getCommonStyles,
  getSelectorStyles,
  SelectorStyleProps,
} from './helpers/styles';
import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';

const styles = getFileContent('css/style.css');

const selectorStyleProps: SelectorStyleProps = {
  '*': [
    {
      rule: RegExp('box-sizing'),
      definition: RegExp('border-box'),
    },
  ],
};

const selectorStylesFound = getSelectorStyles(selectorStyleProps, styles);

if (selectorStylesFound) {
  sendSuccess('Блочная модель для всех элементов задана');
} else {
  sendWarning('В style.css не задана блочная модель для всех элементов');
}

console.log('\nПроверка на заданные размеры:');
const commonSizeStyles: CommonStyleProps = [
  {
    rule: RegExp('max-height'),
  },
  {
    rule: RegExp('max-width'),
  },
  {
    rule: RegExp('min-height'),
  },
  {
    rule: RegExp('min-width'),
  },
  {
    rule: RegExp('width'),
  },
  {
    rule: RegExp('^height'),
  },
];

const { oneFound: sizesPropFound } = getCommonStyles(commonSizeStyles, styles);

if (sizesPropFound) {
  sendSuccess('Есть селекторы с заданным размером');
} else {
  sendError('Нигде не определены размеры');
}

console.log('\nПроверка на заданные margin и padding:');
const commonDistanceStyles: CommonStyleProps = [
  {
    rule: RegExp('padding'),
  },
  {
    rule: RegExp('margin'),
  },
];

console.log();
const { oneFound: distancePropFound } = getCommonStyles(
  commonDistanceStyles,
  styles,
);

if (distancePropFound) {
  sendSuccess('Есть селекторы с заданными margin или padding');
} else {
  sendError('Ни margin, Ни padding нигде не заданы');
}

console.log('\nПроверка на заданные position и z-index:');
const commonPositionStyles: CommonStyleProps = [
  {
    rule: RegExp('position'),
    definition: RegExp('relative'),
  },
  {
    rule: RegExp('position'),
    definition: RegExp('absolute'),
  },
  {
    rule: RegExp('z-index'),
  },
];

const { oneFound: positionPropFound } = getCommonStyles(
  commonPositionStyles,
  styles,
);

if (positionPropFound) {
  sendSuccess('Есть селекторы с заданными свойствами position или z-index');
} else {
  sendError('Свойства position и z-index нигде не задано');
}
