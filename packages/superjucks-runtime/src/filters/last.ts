export default function last<T>(iterable: Iterable<T>): T {
  const arr = [ ...iterable ];
  return arr.pop();
}
