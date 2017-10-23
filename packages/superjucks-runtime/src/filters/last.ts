export default function last<T>(iterable: Iterable<T>): T {
  return [ ...iterable ].pop();
}
