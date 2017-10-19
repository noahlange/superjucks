import { brandedSafeString, brandSafeString } from '../runtime';

export default function safe(str: string): string {
  if (brandedSafeString(str)) {
    return str;
  }
  str = (str === null || str === undefined) ? '' : str;
  return brandSafeString(str);
}
