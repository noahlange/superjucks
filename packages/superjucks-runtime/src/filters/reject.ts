function reject<T>(arr: T, attr?: keyof T[keyof T]): T[];
function reject<T>(arr: T[], attr?: keyof T): T[];
function reject<T>(arr: T[] | T, attr?: keyof T | keyof T[keyof T]): T[] {
  return Array.isArray(arr)
    ? attr
      ? arr.filter(item => !item[attr as keyof T])
      : arr.filter(item => !item)
    : Object.keys(arr)
        .filter(k => (attr ? !arr[k][attr] : !arr[k]))
        .reduce((prev, k) => Object.assign(prev, { [k]: arr[k] }), {} as any);
}

export default reject;
