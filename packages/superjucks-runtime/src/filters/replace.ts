export default function replace(str: string, from: string, to: string) {
  return str.replace(new RegExp(from, 'g'), to);
}
