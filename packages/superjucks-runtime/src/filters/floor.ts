export default function floor(n: number | string): number {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  return Math.floor(n);
}
