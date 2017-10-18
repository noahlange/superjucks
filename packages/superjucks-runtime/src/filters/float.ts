export default function float(val: number | string, def?: any) {
  const res = parseFloat(typeof val === 'string' ? val : '' + val);
  return isNaN(res) ? def : res;
}
