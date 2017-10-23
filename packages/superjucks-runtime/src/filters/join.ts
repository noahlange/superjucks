export default function join<T>(array: T[], delimiter: string = '', attr: keyof T | null = null) {
  return attr !== null ? array.map(v => v[attr]).join(delimiter) : array.join(delimiter);
}
