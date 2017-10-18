export default function select(arr: any[] | any, attr: string) {
  return Array.isArray(arr) ?
    arr.filter(item => !!item[ attr ]) :
    Object.keys(arr)
      .filter(k => attr ? !!arr[k][attr] : !!arr[k])
      .reduce((prev, k) => Object.assign(prev, { [k]: arr[k] }), {} as any);
}
