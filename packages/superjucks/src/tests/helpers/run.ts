import runtime from 'superjucks-runtime';
import Superjucks from '../../configs/Superjucks/Config';
import compile from './compile';
import { ast } from './parse';

export default async function run(input: string, ctx?: any) {
  const parsed = ast(input);
  const str = await compile(parsed);
  const fn = new Function(str)();
  return fn(runtime(ctx, new Superjucks()));
}
