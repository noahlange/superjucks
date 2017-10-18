export default function ltrim(str: string) {
  const firstNonWhitespaceCharacter = str.search(/\S/);
  return str.slice(firstNonWhitespaceCharacter);
}
