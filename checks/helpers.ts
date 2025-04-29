import { existsSync } from 'fs';

const sendSuccess = (message: string) => {
  console.log(`✅ ${message}`);
};

const sendError = (message: string) => {
  console.log(`❌ ${message}`);
};

export const checkFileExists = (filepath: string) => {
  if (!existsSync(filepath)) {
    sendError(`Файл НЕ найден: ${filepath}`);
    process.exit(1);
  }

  sendSuccess(`Файл найден: ${filepath}`);
};

export const findHTMLTags = (tags: string[], htmlContent: string) => {
  const delCommRegexp = new RegExp('<!--.*-->', 'gs');
  htmlContent = htmlContent.replaceAll(delCommRegexp, '');

  let errorDetected = false;
  for (const tag of tags) {
    const regexp = new RegExp(`<\/*${tag}(.[^<])*\/*>`, 'i');
    const found = regexp.test(htmlContent);
    if (!found) {
      sendError(`Тег <${tag}> НЕ найден`);
      errorDetected = true;
    }
  }

  if (!errorDetected) {
    sendSuccess('Все теги найдены');
  }
};
