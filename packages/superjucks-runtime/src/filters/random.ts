export default function random<T>(iterable: Iterable<any>): T {
  const arr = [ ...iterable ];
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
}
