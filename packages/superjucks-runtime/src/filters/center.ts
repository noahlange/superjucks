import { copySafeness } from '../runtime';

export default function center(str: string = '', width = 80) {
  if (str.length >= width) {
    return str.slice(0, width);
  }
  const ret = str || '';
  const spaces = width - ret.length;
  const pre = ' '.repeat(spaces / 2 - spaces % 2);
  const post = ' '.repeat(spaces / 2);
  return copySafeness(ret, pre + str + post);
}
