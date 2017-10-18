export default function dividedBy(value: number, toDivideBy: number) {
  const isInteger = Number.isInteger(toDivideBy);
  const divided = value / toDivideBy;
  return isInteger ? Math.floor(divided) : divided;
}
