export default function sum(arr: any[], attr: string | null = null, start: string | number = 0) {
  return (attr ? arr.map(v => v[attr]) : arr).reduce((a, b) => a += b, start);
}
