import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { sendError } from './helpers/common';

const scriptNumber = process.argv[2];

if (isNaN(Number(scriptNumber))) {
  sendError('Не указан номер скрипта.');
  console.log('Пример: npm run check-labs 1');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptPath = join(__dirname, `lab${scriptNumber}.ts`);

if (!existsSync(scriptPath)) {
  sendError(`Скрипт lab${scriptNumber}.ts не найден по пути: ${scriptPath}`);
  process.exit(1);
}

await import(scriptPath);
