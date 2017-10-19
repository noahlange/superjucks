export default function trimNewlines(str: string, replace: string = '') {
  return str.replace('\n', replace);
}
