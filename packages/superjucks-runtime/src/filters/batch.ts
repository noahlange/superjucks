import { take } from 'lodash';

export default function batch(arr: any[], slices: number, filler: any = null): any[][] {
  const res: any[] = [];
  const len = Math.ceil(arr.length / slices);
  const extras = arr.length % slices;
  let curr = 0;
  while (curr < slices) {
    const slice = take(arr, len);
    arr = arr.slice(len);
    while (slice.length < len) {
      slice.push(filler);
    }
    res[curr] = slice;
    curr++;
  }
  return res;
}
