export default function first(iterable: Iterable<any>) {
  for (const item of iterable) {
    return item;
  }
}
