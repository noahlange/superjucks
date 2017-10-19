export default function sort(arr: any[]) {
  return arr.sort((a, b) => {
    const astr = a.toString();
    const bstr = b.toString();
    return astr.localeCompare(bstr);
  });
}
