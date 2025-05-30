import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';
import {
  CommonStyleProps,
  getCommonStyles,
  getMediaQueries,
} from './helpers/styles';

console.log('Проверка наличия медиа-запросов');
const styles = getFileContent('css/style.css');
const mediaQueries = getMediaQueries(styles);
if (!mediaQueries.length) {
  sendError('Медиа-запросы не найдены');
} else {
  sendSuccess('Есть медиа-запросы');
}

console.log('\nПроверка определения ширины для экранов 320px и 2560px');
const widthStyleProps: CommonStyleProps = [
  { rule: /min\-width/, definition: /320px/ },
  { rule: /max\-width/, definition: /2560px/ },
];

const { allFound: hasWidth } = getCommonStyles(widthStyleProps, styles);

if (!hasWidth) {
  sendWarning(
    'Не указана минимальная ширина в 320px или максимальная в 2560px',
  );
} else {
  sendSuccess(
    'Указана минимальная ширина в 320px, а таже максимальная в 2560px',
  );
}

console.log('\nПроверка наличия скрытых в мобильной версии элементов');
const hiddenStyleProps: CommonStyleProps = [
  { rule: /display/, definition: /none/ },
];

const { oneFound: hasHiddenElems } = getCommonStyles(hiddenStyleProps, styles);

if (!hasHiddenElems) {
  sendError('Отсутствуют стили с display: none');
} else {
  sendSuccess('Есть стили с display: none');
}

console.log('\nПроверка наличия брейкпоинтов');
let found = 0;
for (const media of mediaQueries) {
  if (media.query.includes('min-width') || media.query.includes('max-width')) {
    found++;
  }
}
if (found < 2) {
  sendError('Использовано меньше двух брейкпоинтов');
} else {
  sendSuccess(`Найдено брейкпоинтов: ${found}`);
}
