import { resolve } from 'path';
import { sendError } from './helpers/common';
import { existsSync } from 'fs';
import { CLI } from 'html-validate';

const filepath = process.argv[2];

if (!filepath) {
  sendError('Нужно указать имя файла');
  console.log('Пример: "npm run validate index.html"');
  process.exit(1);
}

const fullPath = resolve(process.cwd(), filepath);
if (!existsSync(fullPath)) {
  sendError(
    `Файл для валидации не найден. Проверьте указанный путь: ${fullPath}`,
  );
  process.exit(1);
}

const cli = new CLI();
const htmlvalidate = await cli.getValidator();
const formatter = await cli.getFormatter('stylish');
const report = await htmlvalidate.validateFile(filepath);
console.log(formatter(report));
