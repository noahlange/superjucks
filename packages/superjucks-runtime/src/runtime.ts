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

export function range(min: number, max: number, step: number = 1, inclusive: boolean = false) {
  const len = Math.max(Math.ceil((max - min) / step), 0);
  const res = Array(len);
  let idx = 0;
  for (let x = min; inclusive ? (x <= max) : (x < max); x += step) {
    res[idx++] = x;
  }
  return res;
}

export function iterasync(i, forEach, ifElse) {
  const promises = [];
  return new Promise(async (resolve, reject) => {
    for await (const item of i) {
      promises.push(forEach(item));
    }
    if (promises.length === 0) {
      promises.push(ifElse());
    }
    for (const p of promises) {
      await p;
    }
    resolve();
  });
}
export function itersync(iterable: Iterable<any>, forEach, ifElse) {
  const promises = [];
  return new Promise(async (resolve, reject) => {
    for (const item of iterable) {
      promises.push(forEach(item));
    }
    if (promises.length === 0) {
      promises.push(ifElse());
    }
    for (const p of promises) {
      await p;
    }
    resolve();
  });
}

export default function runtime(ctx: any, cfg: any, frame: Frame) {
  this.ctx = ctx || {};
  const buffer = new Buffer();
  return {
    Buffer,
    buffer,
    contains,
    entries,
    filter: (filter: string, ...args: any[]) =>
      cfg.filters[filter].apply(this, args),
    frame,
    iter: {
      async: iterasync,
      sync: itersync
    },
    lookup: (k) => (k in this.ctx)
      ? this.ctx[k]
      : frame.lookup(k),
    range,
    test: (test: string, ...args: any[]) => {
      return cfg.tests[test].apply(this, args);
    }
  };
}

export { Filters, Tests };
