import { entries } from '../runtime';

export default function split(val: string | any[] | { [key: string]: any } | Map<any, any> | Set<any>) {
  return typeof val === 'string' ? val.split('') : [ ...entries(val) ];
}
