import { isObject } from 'lodash';

export default function iterable(value: any) {
  return !!value[Symbol.iterator] || isObject(value);
}
