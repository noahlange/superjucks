import { copySafeness } from '../runtime';

function normalize(value: any, defaultValue = '') {
  return value !== 0 && !value ? defaultValue : value;
}

export default function truncate(input = '', length = 255, breakWord: boolean, end: string = '...') {
  const orig = input;
  let normalized = normalize(input);
  if (normalized.length <= length) {
    return normalized;
  }
  if (breakWord) {
    normalized = normalized.substring(0, length);
  } else {
    const idx = normalized.indexOf(' ', length);
    normalized = normalized.substring(0, idx === -1 ? length : idx);
  }
  return copySafeness(orig, normalized += end);
}
