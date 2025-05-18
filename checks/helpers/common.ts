import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export const sendSuccess = (message: string) => {
  console.log(`✅ ${message}`);
};

export const sendWarning = (message: string) => {
  console.log(`⚠️  ${message}`);
};

export const sendError = (message: string) => {
  console.log(`❌ ${message}`);
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
