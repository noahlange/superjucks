export default function iterable(value: any) {
  return !!value[Symbol.iterator];
}
