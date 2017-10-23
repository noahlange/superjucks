export default function round(n: number | string): number {
  n = typeof n === 'string' ? parseFloat(n) : n;
  return Math.round(n);
}
