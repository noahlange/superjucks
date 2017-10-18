export default function int(val: string, def: any) {
  const res = parseInt(val, 10);
  return isNaN(res) ? def : res;
}
