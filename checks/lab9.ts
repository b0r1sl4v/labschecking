import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';
import {
  getSelectorStyles,
  getCommonStyles,
  SelectorStyleProps,
  CommonStyleProps,
} from './helpers/styles';

const cssContent = getFileContent('css/style.css');

console.log('\nПроверка замены стандартного выделения:');
const selectionRules: SelectorStyleProps = {
  '::selection': [
    {
      rule: /background/,
    },
    {
      rule: /color/,
    },
  ],
};

const selectionFound = getSelectorStyles(selectionRules, cssContent);
if (selectionFound) {
  sendSuccess('Стили для выделения найдены');
} else {
  sendWarning(
    'Некоторые применимые для выделения стили не найдены или отсутствует селектор',
  );
}

console.log(
  '\nПроверка наличия стилей для псевдоклассов hover, active, focus:',
);
const pseudoclassRules: SelectorStyleProps = {
  ':hover': [
    {
      rule: /color/,
    },
    {
      rule: /background/,
    },
    {
      rule: /padding/,
    },
    {
      rule: /border/,
    },
  ],
  ':active': [
    {
      rule: /color/,
    },
    {
      rule: /background/,
    },
    {
      rule: /padding/,
    },
    {
      rule: /border/,
    },
  ],
  ':focus': [
    {
      rule: /color/,
    },
    {
      rule: /background/,
    },
    {
      rule: /padding/,
    },
    {
      rule: /border/,
    },
  ],
};

const pseudoclassesRulesFound = getSelectorStyles(pseudoclassRules, cssContent);
if (pseudoclassesRulesFound) {
  sendSuccess('Все правила для стилей псевдоклассов найдены');
} else {
  sendWarning('Найдены не все правила для стилей псевдоклассов');
}

console.log('\nПроверка наличия изменений через transition');
const transitionStyles: CommonStyleProps = [
  {
    rule: /transition/,
  },
];
const { allFound: hasTransitionRules } = getCommonStyles(
  transitionStyles,
  cssContent,
);
if (hasTransitionRules) {
  sendSuccess('Есть указанное свойство transition');
} else {
  sendError('Нет ни одного указанного transition');
}

const placeholderRules: SelectorStyleProps = {
  '::placeholder': [
    {
      rule: /color/,
    },
    {
      rule: /background-color/,
    },
  ],
};

const hasPlaceholderRules = getSelectorStyles(placeholderRules, cssContent);

if (hasPlaceholderRules) {
  sendSuccess('Все правила для плейсхолдеров найдены');
} else {
  sendWarning('Найдены не все правила для плейсхолдеров');
}

console.log('\nПроверка наличия стилей для ярлыков полей в фокусе');
const labelRules: SelectorStyleProps = {
  ':focus + label': [
    {
      rule: /.+/,
    },
  ],
};
const hasLabelRules = getSelectorStyles(labelRules, cssContent);
if (hasLabelRules) {
  sendSuccess('Есть стили для ярлыков полей');
} else {
  sendWarning('Стилей для ярлыков полей может не быть');
}

console.log('\nПроверка наличия стилей для выбранных радиокнопок и чекбоксов');
const checkedRules: SelectorStyleProps = {
  ':checked': [
    {
      rule: /.+/,
    },
  ],
};
const hasCheckedRules = getSelectorStyles(checkedRules, cssContent);
if (hasCheckedRules) {
  sendSuccess('Есть стили для выбранных радиокнопок и чекбоксов');
} else {
  sendWarning('Стилей для выбранных радиокнопок и чекбоксов может не быть');
}

console.log('\nПроверка наличия стилей для терминов и определений');
const DictRules: SelectorStyleProps = {
  '::first-letter': [
    {
      rule: /font-size|font-weight/,
    },
  ],
  '::before': [
    {
      rule: /content/,
      definition: /🛈/,
    },
  ],
};
const hasDictRules = getSelectorStyles(DictRules, cssContent);
if (hasDictRules) {
  sendSuccess('Есть стили для буквицы, а также добавлен элемент "🛈"');
} else {
  sendWarning('Стилей для dl+dt может не быть');
}
