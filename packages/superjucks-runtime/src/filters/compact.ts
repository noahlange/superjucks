export default function compact<T>(array: T[]) {
  return array.filter(f => f !== undefined && f !== null);
}
