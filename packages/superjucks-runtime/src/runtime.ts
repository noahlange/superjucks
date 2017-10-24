import { Config, Frame } from 'superjucks';
import Buffer from './Buffer';
import * as Filters from './filters/index';
import * as Tests from './test/index';

const escaped = '__superjucks_escaped__';

export { Filters, Tests };

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
  return input[escaped]
    ? output[escaped]
      ? output
      : brandSafeString(output)
    : output.toString();
}

export function entries(
  object: string | any[] | Map<any, any> | Set<any> | any
) {
  if (!object) {
    return [];
  } else {
    if (object[Symbol.iterator]) {
      return object;
    } else {
      return Object.entries(object);
    }
  }
}

export function contains(val: any, key: string | number): boolean {
  if (Array.isArray(val)) {
    return val.indexOf(key) !== -1;
  } else if (val instanceof Map || val instanceof Set) {
    return val.has(key);
  } else if (typeof val === 'string') {
    return val.includes(key.toString());
  } else {
    try {
      return key in val;
    } catch (e) {
      throw new Error(
        `Cannot use 'in' operator to search for '${key}' in unexpected types.`
      );
    }
  }
}

export default function runtime(ctx: any, cfg: Config, frame: Frame) {
  this.ctx = ctx;
  const buffer = new Buffer();
  return {
    buffer,
    contains,
    entries,
    frame
  };
}
