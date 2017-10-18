export default function abs(value: number | string): number {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return isNaN(value) ? NaN : Math.abs(value);
}
