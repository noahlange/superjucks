interface IStringish {
  [key: string]: string;
}

interface INumberish {
  [key: string]: number;
}

function sum<T extends string>(arr: T[], attr?: never, start?: string): string;
function sum<T extends number>(arr: T[], attr?: never, start?: number): number;
function sum<T extends IStringish>(arr: T[], attr?: never, start?: string): string;
function sum<T extends INumberish>(arr: T[], attr?: never, start?: number): number;
function sum<T extends object>(arr: T[], attr?: keyof T | null, start?: string | number): string | number;
function sum<T>(arr: T[], attr: keyof T | never | null = null, start: string | number = 0): string | number {
  const toReduce = attr === null ? arr : arr.map(v => v[attr]);
  return (toReduce as any[]).reduce((a, b) => a += b, start);
}

export default sum;
