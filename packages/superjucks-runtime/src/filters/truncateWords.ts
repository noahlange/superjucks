import { copySafeness } from '../runtime';

function normalize(value: any, defaultValue = '') {
  return value !== 0 && !value ? defaultValue : value;
}

export default function truncate(input = '', length = 3, end: string = '...') {
  const orig = input;
  const normalized = (normalize(input) as string).split(/\s/);
  if (normalized.length <= length) {
    return orig;
  }
  return copySafeness(orig, normalized.slice(0, length - 1).join(' ') + end);
}
