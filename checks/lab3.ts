import {
  CommonStyleProps,
  getCommonStyles,
  getFileContent,
  getSelectorStyles,
  SelectorStyleProps,
  sendSuccess,
} from './helpers';

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

// TODO: write a function returning true if at least 1 rule has been found. It will considerably simplify check comprehension
const commonStyleProps: CommonStyleProps = [
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
    rule: RegExp('height'),
  },
  {
    rule: RegExp('padding'),
  },
  {
    rule: RegExp('margin'),
  },
  {
    rule: RegExp('poition'),
    definition: RegExp('relative'),
  },
  {
    rule: RegExp('poition'),
    definition: RegExp('absolute'),
  },
  {
    rule: RegExp('z-index'),
  },
];

const commonStylesFound = getCommonStyles(commonStyleProps, styles);

if (selectorStylesFound && commonStylesFound) {
  sendSuccess('Все стили найдены');
}
