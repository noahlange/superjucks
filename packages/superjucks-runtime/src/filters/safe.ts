import { brandSafeString, brandedSafeString } from '../runtime';

export default function safe(str: string) {
  if (brandedSafeString(str)) {
    return str;
  }
  str = (str === null || str === undefined) ? '' : str;
  return brandSafeString(str);
}
