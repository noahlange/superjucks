export default function join(array: any[], delimiter: string = '', attr: string | null = null) {
  return attr !== null ? array.map(v => v[attr]).join(delimiter) : array.join(delimiter);
}
