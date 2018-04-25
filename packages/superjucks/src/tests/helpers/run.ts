import runtime from 'superjucks-runtime';
import Superjucks from '../../configs/Superjucks/Config';

import Compiler from '../../Compiler';
import Frame from '../../Frame';
import { ast } from './parse';

export default async function run(input: string, ctx?: any) {
  const str = await Compiler.compile(input);
  try {
    const fn = new Function(str)();
    const lib = runtime(ctx, new Superjucks(), new Frame());
    return fn(lib);
  } catch (e) {
    console.info(str);
  }
}
