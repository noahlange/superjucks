export default function map<T>(array: T[], key: keyof T): Array<T[keyof T]> {
  return array.map(item => item[key]);
}
