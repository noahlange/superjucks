export default function replaceFirst(str: string, from: string, to: string = '') {
  return str.replace(new RegExp(from), to);
}
