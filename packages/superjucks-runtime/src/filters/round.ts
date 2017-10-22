export default function round(n: number | string) {
  n = typeof n === 'string' ? parseFloat(n) : n;
  return Math.round(n);
}
