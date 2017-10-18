export default function last(iterable: Iterable<any>) {
  return [ ...iterable ].pop();
}
