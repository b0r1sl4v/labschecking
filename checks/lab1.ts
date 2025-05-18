import { getFileContent } from './helpers/common';
import { getHTMLTags } from './helpers/markup';

const markup = getFileContent('index.html');

const tags = ['header', 'footer', 'main', 'section']; // TODO: find more common tags of all given templates

getHTMLTags(tags, markup);
