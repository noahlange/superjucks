export default function sortBy<T>(arr: T[], attr: keyof T): T[] {
  return arr.sort((a, b) => {
    const astr = a[attr].toString();
    const bstr = b[attr].toString();
    return astr.localeCompare(bstr);
  });
}
