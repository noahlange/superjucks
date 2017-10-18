export default function rtrim(str: string) {
  const reversed = str.split('').reverse().join('');
  const lastNonWhitespaceCharacter = reversed.search(/\S/);
  return str.slice(0, str.length - lastNonWhitespaceCharacter);
}
