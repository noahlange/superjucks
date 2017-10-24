import * as escape from 'escape-html';
import { brandedSafeString, brandSafeString } from '../runtime';

export default function(val: string): string {
  return brandedSafeString(val) ? val : brandSafeString(escape(val));
}
