import { copySafeness } from '../runtime';

export default function reverse(val: string | any[]) {
  const reversed = (Array.isArray(val) ? val : val.split('')).reverse();
  return Array.isArray(val) ? reversed : copySafeness(val, reversed.join(''));
}
