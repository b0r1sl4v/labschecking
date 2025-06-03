import {
  getFileContent,
  sendError,
  sendSuccess,
  sendWarning,
} from './helpers/common';
import { getHTMLTags } from './helpers/markup';

console.log('\nПроверка существования файла form.html:');
const formContent = getFileContent('form.html');

console.log('\nПроверка ссылки на form.html в index.html:');
const htmlContent = getFileContent('index.html');
const linkTags = ['a'];
const formLinks = getHTMLTags(linkTags, htmlContent)['a'];

let hasFormLink = false;
if (formLinks) {
  for (const link of formLinks) {
    if (
      link.getAttribute('href')?.includes('form.html') &&
      link.textContent?.toLowerCase().includes('форма')
    ) {
      hasFormLink = true;
    }
  }
}

if (hasFormLink) {
  sendSuccess('В index.html есть ссылка на form.html');
} else {
  sendError('В index.html нет ссылки на form.html');
}

console.log('\nПроверка тега form');
const formTags = ['form[method="POST"][action="//httpbin.org/post"]'];
const forms = getHTMLTags(formTags, formContent)[formTags[0]];
if (forms.length) {
  sendSuccess('Тег form оформлен по правилам');
} else {
  sendError('Тег form оформлен неправильно');
}

console.log('\nПроверка правильности применения тегов fieldset и legend');
const fieldTags = ['fieldset', 'fieldset>legend'];
const fields = getHTMLTags(fieldTags, forms[0]?.innerHTML);
if (fields[fieldTags[0]]?.length && fields[fieldTags[1]]?.length) {
  sendSuccess('fieldset и legend применены правильно');
} else {
  sendError('fieldset и legend применены неправильно');
}

console.log('\nПроверка наличия необходимых типов полей ввода');
const inputTypes = [
  'text',
  'date',
  'radio',
  'password',
  'email',
  'tel',
  'checkbox',
];
const inputTags = inputTypes.map((type) => `form input[type="${type}"]`);
const inputs = getHTMLTags(inputTags, formContent);

let hasAll = true;
for (const tag of inputTags) {
  if (!inputs[tag]?.length) {
    hasAll = false;
  }
}

if (hasAll) {
  sendSuccess('Нужные типы полей ввода на месте');
} else {
  sendWarning('Некоторых нужных типов полей ввода нет');
}

console.log(
  '\nПроверка правильности определения типов кнопок для отправки и сброса данных',
);
const buttonTags = ['form button[type="submit"]', 'form button[type="reset"]'];
const buttons = getHTMLTags(buttonTags, formContent);
if (buttons[buttonTags[0]]?.length && buttons[buttonTags[1]]?.length) {
  sendSuccess('Существуют необходимые кнопки с верно указанными типами');
} else {
  sendError('У кнопок неверно указаны типы, либо они отсутствуют');
}
