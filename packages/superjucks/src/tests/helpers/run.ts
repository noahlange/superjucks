import runtime from 'superjucks-runtime';
import Superjucks from '../../configs/Superjucks/Config';
import Frame from '../../Frame';
import compile from './compile';
import { ast } from './parse';

export default async function run(input: string, ctx?: any) {
  const parsed = ast(input);
  const str = await compile(parsed);
  try {
    const fn = new Function(str)();
    const lib = runtime(ctx, new Superjucks(), new Frame());
    return fn(lib);
  } catch (e) {
    console.info(str);
  }
}
