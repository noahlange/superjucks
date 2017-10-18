export default function wordcount(str: string) {
  const words = (str || '').match(/\w+/g);
  return words ? words.length : null;
}
