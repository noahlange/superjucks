export default function round(n: number | string) {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  return Math.round(n);
}
