export default function sortBy(arr: any[], prop: string) {
  return arr.sort((a, b) => a[prop].localeCompare(b[prop]));
}
