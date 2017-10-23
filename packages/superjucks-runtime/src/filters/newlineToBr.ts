import { copySafeness } from '../runtime';

export default function nl2br(str: string): string {
  return str === null || str === undefined
    ? ''
    : copySafeness(str, str.replace(/\r\n|\n/g, '<br />\n'));
}
