import { parse as parseDOM } from 'node-html-parser';
import { sendError, sendSuccess } from './common';

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
