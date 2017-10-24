export default function unique<T>(arr: T[]): T[] {
  const out = [];
  do {
    const item = arr.pop();
    if (!out.includes(item)) {
      out.push(item);
    }
  } while (arr.length);
  return out;
}
