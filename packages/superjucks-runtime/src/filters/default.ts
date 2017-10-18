export default function(val: string, def: any) {
  const undefinedish = val === undefined;
  return undefinedish ? def : val;
}
