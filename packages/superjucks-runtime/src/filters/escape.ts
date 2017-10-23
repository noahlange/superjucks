import { escape } from 'lodash';
import { brandSafeString } from '../runtime';

export default function(val: string): string {
  return brandSafeString(escape(val));
}
