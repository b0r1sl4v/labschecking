import { existsSync, readFileSync } from 'fs';
import { parse as parseDOM } from 'node-html-parser';
import { parse as parseStyles } from 'css';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const sendSuccess = (message: string) => {
  console.log(`✅ ${message}`);
};

export const sendError = (message: string) => {
  console.log(`❌ ${message}`);
};

// TODO: add and use sendWarning() => {} in not fatal cases

type GetFileContent = (relativePath: string) => string;

export const getFileContent: GetFileContent = (relativePath) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filepath = resolve(__dirname, '..', relativePath);
  if (!existsSync(filepath)) {
    sendError(`Файл НЕ найден: ${filepath}`);
    process.exit(1);
  }

  sendSuccess(`Файл найден: ${filepath}`);

  let fileContent: string;
  try {
    fileContent = readFileSync(filepath, 'utf-8');
  } catch (error) {
    sendError(error);
    process.exit(1);
  }

  return fileContent;
};

type GetHTMLTags = (
  tags: string[],
  htmlContent: string,
) => Record<string, HTMLElement[]>;

export const getHTMLTags: GetHTMLTags = (tags, htmlContent) => {
  let errorDetected = false;
  const result = {};
  const root = parseDOM(htmlContent);

  for (const tag of tags) {
    const found = root.querySelectorAll(tag);
    if (!found.length) {
      sendError(`Тег <${tag}> НЕ найден`);
      errorDetected = true;
      continue;
    }

    result[tag] = found;
  }

  if (!errorDetected) {
    sendSuccess('Все теги найдены');
  }

  return result;
};

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
type GetCommonStyles = (props: CommonStyleProps, cssContent: string) => boolean;

export const getCommonStyles: GetCommonStyles = (props, cssContent) => {
  const stylesTree = parseStyles(cssContent).stylesheet?.rules;
  if (!stylesTree) {
    sendError('Стили некорректны');
    process.exit(1);
  }

  let allFound = true;
  for (const prop of props) {
    let found = false;
    for (const rulesBlock of stylesTree) {
      if (rulesBlock.type !== 'rule' || !rulesBlock.declarations?.length)
        continue;
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
    }

    if (!found) {
      const errorText =
        prop.errorText ??
        `Правило "${prop.rule}" ` +
          (prop.definition
            ? `со значением ${prop.definition} `
            : 'не было найдено');
      sendError(errorText);
      allFound = false;
    }
  }

  return allFound;
};
