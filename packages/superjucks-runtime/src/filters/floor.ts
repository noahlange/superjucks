export default function floor(n: number | string) {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  return Math.floor(n);
}
