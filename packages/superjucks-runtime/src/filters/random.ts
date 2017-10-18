export default function random(arr: any[]): any {
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
}
