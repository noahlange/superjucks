export default function length(obj: Iterable<any> | any): number {
  return obj[Symbol.iterator] ? [...obj].length : Object.keys(obj).length;
}
