export default function float(val: string, def: any) {
  const res = parseFloat(val);
  return isNaN(res) ? def : res;
}
