export default function dictsort<T>(object: T, caseSensitive?: boolean, by?: 'key' | 'value'): Array<[keyof T, T]> {

  if (!object || !object.toString().match(/object Object/)) {
    throw new Error('dictsort: You must pass an object to sort');
  }
  const array: Array<[ keyof T, T ]> = Object.keys(object).map(k => [ k, object[k] ]) as any;
  let si: 0 | 1;
  if (by === undefined || by === 'key') {
    si = 0;
  } else if (by === 'value') {
    si = 1;
  } else {
    throw new Error('dictsort filter: You can only sort by either key or value');
  }

  return array.sort((t1, t2) => {
    let a: any = t1[si];
    let b: any = t2[si];
    if (!caseSensitive) {
      if (typeof a === 'string') {
        a = a.toUpperCase();
      }
      if (typeof b === 'string') {
        b = b.toUpperCase();
      }
    }
    return a > b ? 1 : (a === b ? 0 : -1);
  });
}
