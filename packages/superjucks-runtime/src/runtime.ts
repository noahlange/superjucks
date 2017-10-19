import { escape, get, isObject, isString, toPairs } from 'lodash';

const escaped = '__superjucks_escaped__';

export function brandSafeString(str: string): any {
  // tslint:disable-next-line no-construct
  const out = new String(str);
  Object.defineProperty(out, escaped, { value: true });
  return out;
}

export function brandedSafeString(str: string): boolean {
  return !!str[escaped];
}

export function copySafeness(input: string, output: string) {
  return input[escaped] ? brandSafeString(output) : output;
}

export function entries(object: string | any[] | Map<any, any> | Set<any> | any) {
  if (!object) {
    return [];
  } else {
    if (object[Symbol.iterator]) {
      return object;
    } else {
      return toPairs(object);
    }
  }
}
