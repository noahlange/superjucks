/*
 * Implementation based on Lodash's `shuffle` method, released under the MIT
 * license.
 */
function _(arr: any[]) {
  const out = arr.slice();
  const len = out.length;
  let idx = 0;
  const last = len - 1;
  while (idx < len) {
    const random = idx + Math.floor(Math.random() * (last - idx + 1));
    const item = arr[random];
    out[random] = arr[idx];
    out[idx] = item;
    idx++;
  }
  return out;
}

function shuffle(iterable: string): string;
function shuffle<T>(iterable: T[]): T[];
function shuffle(iterable: string | any[]): string | any[] {
  const spread = [ ...iterable ];
  const shuffled: any[] = _(spread);
  return typeof iterable === 'string'
    ? shuffled.join('')
    : shuffled;
}

export default shuffle;
