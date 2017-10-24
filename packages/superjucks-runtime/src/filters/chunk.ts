/*
 * Implementation based on Lodash's `chunk` method, released under the MIT
 * license.
 */
function _chunk<T>(array: T[], size: number) {
  size = Math.max(size, 0);
  const length = array == null ? 0 : array.length;
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

export default function chunk<T>(array: T[], count: number, filler: any = null): T[][] {
  const res = _chunk(array, count);
  if (filler) {
    const pop = res.pop();
    if (pop) {
      let toFill = count - pop.length;
      while (toFill--) {
        pop.push(filler);
      }
      res.push(pop);
    }
  }
  return res;
}
