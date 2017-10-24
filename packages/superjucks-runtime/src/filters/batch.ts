/*
 * Implementation based on Lodash's `batch` method, released under the MIT
 * license.
 */
export default function batch<T>(arr: T[], slices: number, filler: any = null): T[][] {
  const res: any[] = [];
  const len = Math.ceil(arr.length / slices);
  const extras = arr.length % slices;
  let curr = 0;
  while (curr < slices) {
    const slice = arr.slice(0, len);
    arr = arr.slice(len);
    while (slice.length < len) {
      slice.push(filler);
    }
    res[curr] = slice;
    curr++;
  }
  return res;
}
