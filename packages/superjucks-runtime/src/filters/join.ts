export default function join<T>(iterable: Iterable<T>, delimiter: string = '', attr: keyof T | null = null): string {
  const array = [ ...iterable ];
  return attr !== null
    ? array.map(v => v[attr]).join(delimiter)
    : array.join(delimiter);
}
