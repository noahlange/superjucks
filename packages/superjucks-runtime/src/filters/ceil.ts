export default function ceil(n: number | string): number {
  if (typeof n === 'string') {
    n = parseFloat(n);
  }
  return isNaN(n) ? NaN : Math.ceil(n);
}
