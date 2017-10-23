export default function wordcount(str: string): number {
  const words = (str || '').match(/\w+/g);
  return words ? words.length : null;
}
