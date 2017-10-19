export default function sortBy(arr: any[], prop: string) {
  return arr.sort((a, b) => {
    const astr = a[prop].toString();
    const bstr = b[prop].toString();
    return astr.localeCompare(bstr);
  });
}
