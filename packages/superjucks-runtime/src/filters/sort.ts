export default function sort<T>(arr: T[]): T[] {
  return arr.sort((a, b) => {
    const astr = a.toString();
    const bstr = b.toString();
    return astr.localeCompare(bstr);
  });
}
