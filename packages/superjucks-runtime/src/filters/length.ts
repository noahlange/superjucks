export default function length(obj: string | any[] | Map<any, any> | Set<any>): number {
  return Array.isArray(obj) || typeof obj === 'string' ? obj.length : obj.size ? obj.size : Object.keys(obj).length;
}
