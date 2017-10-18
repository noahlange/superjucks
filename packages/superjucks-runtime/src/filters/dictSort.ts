import { isObject, isString } from 'lodash';

export default function dictsort(val: any, caseSensitive: boolean, by: string) {
  if (!isObject(val)) {
    throw new Error('dictsort filter: val must be an object');
  }

  const array = Object.keys(val).map(k => [ k, val[k] ]);
  let si: number;
  if (by === undefined || by === 'key') {
    si = 0;
  } else if (by === 'value') {
    si = 1;
  } else {
    throw new Error('dictsort filter: You can only sort by either key or value');
  }

  array.sort((t1, t2) => {
    let a = t1[si];
    let b = t2[si];
    if (!caseSensitive) {
      if (isString(a)) {
        a = a.toUpperCase();
      }
      if (isString(b)) {
        b = b.toUpperCase();
      }
    }
    return a > b ? 1 : (a === b ? 0 : -1);
  });

  return array;
}
