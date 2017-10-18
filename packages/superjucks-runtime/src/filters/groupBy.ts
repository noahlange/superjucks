export default function groupBy(obj: Iterable<any>, attr: string): object {
  const res: any = {};
  for (const value of obj) {
    const key = value[attr];
    if (res[key]) {
      res[key].push(value);
    } else {
      res[key] = [ value ];
    }
  }
  return res;
}
