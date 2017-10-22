import { copySafeness } from '../runtime';
import trim from './trim';

export default function striptags(input: string, preserveLinebreaks?: boolean) {
  preserveLinebreaks = preserveLinebreaks || false;
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
  const trimmedInput = trim(input.replace(tags, ''));
  let res = '';
  if (preserveLinebreaks) {
    res = trimmedInput
      .replace(/^ +| +$/gm, '')     // remove leading and trailing spaces
      .replace(/ +/g, ' ')          // squash adjacent spaces
      .replace(/(\r\n)/g, '\n')     // normalize linebreaks (CRLF -> LF)
      .replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
  } else {
    res = trimmedInput.replace(/\s+/gi, ' ');
  }
  return copySafeness(input, res);
}
