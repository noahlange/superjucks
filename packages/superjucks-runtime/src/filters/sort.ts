export default function sort(arr: any[]) {
  return arr.sort((a, b) => a.localeCompare(b));
}
