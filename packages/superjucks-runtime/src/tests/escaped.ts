import { brandedSafeString } from '../runtime';

export default function escaped(str: any) {
  return brandedSafeString(str);
}
