import * as changeCase from 'change-case';
import { copySafeness } from '../runtime';

type Transform = 'camel'
  | 'constant'
  | 'dot'
  | 'header'
  | 'lower'
  | 'lcFirst'
  | 'no'
  | 'param'
  | 'pascal'
  | 'path'
  | 'sentence'
  | 'snake'
  | 'swap'
  | 'title'
  | 'upper'
  | 'ucFirst';

/**
 * Transforms a string from one casing style to another.
 * @export
 * @param {string} str
 * @param {transformation} type
 * @returns {(string | SafeString)}
 */
export default function toCase(str: string, type: Transform): string {
  return copySafeness(str, changeCase[type](str));
}
