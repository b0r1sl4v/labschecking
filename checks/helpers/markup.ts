import { parse as parseDOM } from 'node-html-parser';
import { sendError, sendSuccess } from './common';

type GetHTMLTags = (
  selectors: string[],
  htmlContent: string,
) => Record<string, HTMLElement[]>;

export const getHTMLTags: GetHTMLTags = (selectors, htmlContent) => {
  let errorDetected = false;
  const result = {};
  const root = parseDOM(htmlContent);

  for (const selector of selectors) {
    const found = root.querySelectorAll(selector);
    if (!found.length) {
      sendError(`Селектор "${selector}" НЕ найден`);
      errorDetected = true;
      continue;
    }

    result[selector] = found;
  }

  if (!errorDetected) {
    sendSuccess('Все селекторы найдены');
  }

  return result;
};
