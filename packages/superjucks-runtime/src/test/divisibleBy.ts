export default function divisibleBy(one: number | string, two: number | string) {
  const left = typeof one === 'number' ? one : parseInt(one, 10);
  const right = typeof two === 'number' ? two : parseInt(two, 10);
  return left % right === 0;
}
