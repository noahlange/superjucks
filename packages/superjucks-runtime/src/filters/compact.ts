export default function compact(array: any[]) {
  return array.filter(f => f !== undefined && f !== null);
}
