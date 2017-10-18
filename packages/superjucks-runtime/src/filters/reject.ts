export default function reject(arr: any[] | any, attr?: string) {
  return Array.isArray(arr)
    ? attr ? arr.filter(item => !item[attr]) : arr.filter(item => !item)
    : Object.keys(arr)
        .filter(k => (attr ? !arr[k][attr] : !arr[k]))
        .reduce((prev, k) => Object.assign(prev, { [k]: arr[k] }), {} as any);
}
