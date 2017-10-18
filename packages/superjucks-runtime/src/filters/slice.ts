export default function slice(iterable: string | any[], from: number = 0, to?: number): string | any[] {
  return iterable.slice(from, to);
}
