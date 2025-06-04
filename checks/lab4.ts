import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';
import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';
import { getHTMLTags } from './helpers/markup';
import { getCommonStyles } from './helpers/styles';

console.log('\nПроверка папки с изображениями:');
const imgDirs = ['img', 'images'];
let imgFolderFound = false;

for (const dir of imgDirs) {
  const fullPath = resolve(process.cwd(), dir);
  if (existsSync(fullPath)) {
    imgFolderFound = true;
    const images = readdirSync(fullPath).filter((file) =>
      /\.(png|jpe?g|svg)$/i.test(file),
    );
    if (images.length) {
      sendSuccess(`Папка ${dir} найдена и содержит изображения`);
    } else {
      sendWarning(`Папка ${dir} найдена, но изображений в ней нет`);
    }
    break;
  }
}

if (!imgFolderFound) {
  sendError('Папка с изображениями img или images не найдена');
}

console.log('\nПроверка index.html:');
const htmlContent = getFileContent('index.html');
const tags = getHTMLTags(['img', 'figure'], htmlContent);
const folderName = process.cwd().split('/').slice(-1)[0];

for (const img of tags['img'] || []) {
  const src = img.getAttribute('src');
  if (!src) {
    sendError('<img> без атрибута src');
    continue;
  }
  if (src.includes(folderName)) {
    sendError(`<img src="${src}"> не использует относительный путь`);
  }
  if (!/\.(png|jpe?g|svg)$/i.test(src)) {
    sendError(`<img src="${src}"> имеет неподходящий формат`);
  }
}

console.log('\nПроверка style.css:');
const styles = getFileContent('css/style.css');

console.log('\nПроверка background-image и background-color:');
const backgroundStyleProps = [
  {
    rule: /background-image/,
  },
  {
    rule: /background-color/,
  },
];
const { allFound: backgroundPropsFound } = getCommonStyles(
  backgroundStyleProps,
  styles,
);
if (backgroundPropsFound) {
  sendSuccess('Есть элементы с background-image и background-color');
} else {
  sendWarning('Не найдены элементы с background-image и background-color');
}

console.log('\nПроверка object-fit и object-position:');
const objectProps = [
  {
    rule: /object-fit/,
  },
  {
    rule: /object-position/,
  },
];
const { oneFound: objectPropFound } = getCommonStyles(objectProps, styles);

if (objectPropFound) {
  sendSuccess('Используются object-fit или object-position');
} else {
  sendWarning('object-fit и object-position нигде не используются');
}
