function slice<T>(iterable: string, from?: number, to?: number): string | any[];
function slice<T>(iterable: any[], from?: number, to?: number): any[];
function slice<T>(iterable: string | any[], from?: number, to?: number): string | any[] {
  return iterable.slice(from || 0, to);
}

export default slice;
