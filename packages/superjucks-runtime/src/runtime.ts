import { Config, Frame } from 'superjucks';
import Buffer from './Buffer';
import * as Filters from './filters/index';
import * as Tests from './test/index';

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

export default function runtime(ctx: any, cfg: any, frame: Frame) {
  this.ctx = ctx;
  const buffer = new Buffer();
  return {
    buffer,
    contains,
    entries,
    filter: (filter: string, ...args: any[]) =>
      cfg.filters[filter].apply(this, args),
    frame,
    // @todo stub
    lookup: k => ctx[k],
    range: (min, max, step = 1, inclusive = false) => {
      const len = Math.max(Math.ceil((max - min) / step), 0);
      const res = Array(len);
      let idx = 0;
      for (let x = min; inclusive ? (x <= max) : (x < max); x += step) {
        res[idx++] = x;
      }
      return res;
    }
  };
}

export { Filters, Tests };
