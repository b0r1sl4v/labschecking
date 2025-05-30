import { Media, parse as parseStyles } from 'css';
import { sendError, sendWarning } from './common';

type Rule = {
  rule: RegExp;
  definition?: RegExp;
  errorText?: string;
};

export type SelectorStyleProps = Record<string, Rule[]>;

type GetSelectorStyles = (
  props: SelectorStyleProps,
  cssContent: string,
) => boolean;
export const getSelectorStyles: GetSelectorStyles = (props, cssContent) => {
  let allFound = true;
  const selectorsFound = {};
  const selectorsToFind = Object.keys(props);
  for (const selector of selectorsToFind) {
    selectorsFound[selector] = false;
  }
  const stylesTree = parseStyles(cssContent).stylesheet?.rules;
  if (!stylesTree) {
    sendError('Стили некорректны');
    process.exit(1);
  }

  for (const rulesBlock of stylesTree) {
    if (
      rulesBlock.type !== 'rule' ||
      !rulesBlock.selectors ||
      !rulesBlock.declarations
    )
      continue;
    for (const selector of rulesBlock.selectors) {
      if (selector in props) {
        selectorsFound[selector] = true;
        for (const prop of props[selector]) {
          let found = false;
          for (const rule of rulesBlock.declarations) {
            if (rule.type === 'comment' || !rule.property) continue;
            if (!prop.rule.test(rule.property)) continue;
            if (!prop.definition) {
              found = true;
              break;
            }
            if (
              prop.definition &&
              (!rule.value || !prop.definition?.test(rule.value))
            ) {
              continue;
            }
            found = true;
          }
          if (!found) {
            const errorText =
              prop.errorText ??
              `Правило "${prop.rule}" ` +
                (prop.definition ? `со значением ${prop.definition} ` : '') +
                `в селекторе ${selector} не было найдено`;
            sendError(errorText);
            allFound = false;
          }
        }
      }
    }
  }

  for (const selector of selectorsToFind) {
    if (!selectorsFound[selector]) {
      sendError(`Селектор ${selector} не найден`);
      allFound = false;
    }
  }
  return allFound;
};

export type CommonStyleProps = Rule[];
type GetCommonStyles = (
  props: CommonStyleProps,
  cssContent: string,
) => { oneFound: boolean; allFound: boolean };

export const getCommonStyles: GetCommonStyles = (props, cssContent) => {
  const stylesTree = parseStyles(cssContent).stylesheet?.rules;
  if (!stylesTree) {
    sendError('Стили некорректны');
    process.exit(1);
  }
  let allFound = true;
  let oneFound = false;
  for (const prop of props) {
    let found = false;
    for (const rulesBlock of stylesTree) {
      if (rulesBlock.type !== 'rule' || !rulesBlock.declarations?.length)
        continue;
      for (const rule of rulesBlock.declarations) {
        if (rule.type === 'comment' || !rule.property) continue;
        if (!prop.rule.test(rule.property)) continue;
        if (!prop.definition) {
          oneFound = true;
          found = true;
          break;
        }
        if (
          prop.definition &&
          (!rule.value || !prop.definition?.test(rule.value))
        ) {
          continue;
        }
        oneFound = true;
        found = true;
      }
    }

    if (!found) {
      const errorText =
        prop.errorText ??
        `Правило "${prop.rule}" ` +
          (prop.definition ? `со значением ${prop.definition} ` : '') +
          'не было найдено';
      sendWarning(errorText);
      allFound = false;
    }
  }

  return { allFound, oneFound };
};

type MediaBlock = {
  query: string;
  rules: Media['rules'];
};

type GetMediaQueries = (cssContent: string) => MediaBlock[];

export const getMediaQueries: GetMediaQueries = (cssContent: string) => {
  const stylesTree = parseStyles(cssContent).stylesheet?.rules;
  if (!stylesTree) {
    sendError('Стили некорректны');
    process.exit(1);
  }

  const result: MediaBlock[] = [];

  for (const block of stylesTree) {
    if (block.type !== 'media' || !block.rules?.length || !block.media)
      continue;

    const mediaBlock: MediaBlock = {
      query: block.media,
      rules: block.rules,
    };

    result.push(mediaBlock);
  }

  return result;
};
