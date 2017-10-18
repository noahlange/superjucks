export default function remove(str: string, toRemove: string) {
  return str.replace(new RegExp(toRemove), '');
}
