export default function dividedBy(value: number | string, toDivideBy: number | string) {
  const one = typeof value === 'string' ? parseFloat(value) : value;
  const two = typeof toDivideBy === 'string' ? parseFloat(toDivideBy) : toDivideBy;
  return one / two;
}
