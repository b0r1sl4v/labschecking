import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const GREEN_COLOR = '\x1b[32m%s\x1b[0m';
const YELLOW_COLOR = '\x1b[33m%s\x1b[0m';
const RED_COLOR = '\x1b[31m%s\x1b[0m';

export const sendSuccess = (message: string) => {
  console.log(GREEN_COLOR, `✅ ${message}`);
};

export const sendWarning = (message: string) => {
  console.log(YELLOW_COLOR, `⚠️  ${message}`);
};

export const sendError = (message: string) => {
  console.log(RED_COLOR, `❌ ${message}`);
};

type GetFileContent = (relativePath: string) => string;

export const getFileContent: GetFileContent = (relativePath) => {
  const filepath = resolve(process.cwd(), relativePath);
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
