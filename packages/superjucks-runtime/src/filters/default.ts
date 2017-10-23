export default function(val: string, def: any) {
  return val === undefined ? def : val;
}
