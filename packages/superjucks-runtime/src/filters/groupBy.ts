type IOut<T extends { [key: string]: any }> = {
  [K in T[keyof T]]: T[];
};

export default function groupBy<T extends object>(iterable: Iterable<T>, attr: keyof T) {
  const out: IOut<T> = {} as IOut<T>;
  for (const value of iterable) {
    const key = value[attr];
    if (out[key]) {
      out[key].push(value);
    } else {
      out[key] = [ value ];
    }
  }
  return out;
}
