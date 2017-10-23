import { copySafeness } from '../runtime';

function reverse(val: string): string;
function reverse(val: any[]): any[];
function reverse(val: any[] | string): any | string[] {
  const reversed = (Array.isArray(val) ? val : val.split('')).reverse();
  return Array.isArray(val) ? reversed : copySafeness(val, reversed.join(''));
}

export default reverse;
