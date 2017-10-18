export default function dump(obj: any, spaces: number = 2): string {
  return JSON.stringify(obj, null, spaces);
}
