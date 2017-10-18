export default function odd(num: number | string) {
  return (typeof num === 'number' ? num : parseInt(num, 10)) % 2 === 1;
}
