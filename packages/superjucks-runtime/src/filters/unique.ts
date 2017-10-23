import { uniq } from 'lodash';

export default function unique<T>(arr: T[]): T[] {
  return uniq(arr);
}
