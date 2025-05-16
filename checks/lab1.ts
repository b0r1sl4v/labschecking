import { getFileContent, getHTMLTags } from './helpers';

const markup = getFileContent('index.html');

const tags = ['header', 'footer', 'main', 'section']; // TODO: find more common tags of all given templates

getHTMLTags(tags, markup);
