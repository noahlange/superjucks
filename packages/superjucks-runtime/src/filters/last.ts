export default function last(iterable: IterableIterator<any>) {
  return [ ...iterable ].pop();
}
