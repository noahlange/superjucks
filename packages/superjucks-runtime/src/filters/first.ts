export default function first(arr: IterableIterator<any>) {
  for (const item of arr) {
    return item;
  }
}
