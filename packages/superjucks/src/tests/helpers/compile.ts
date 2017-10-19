import Compiler from '../../Compiler';
import Frame from '../../Frame';
import { parse } from '../../Parser';

export default async function compile(ast?: any, frame = new Frame()): Promise<string> {
  const compiler = new Compiler();
  try {
  await compiler.compile(ast, frame);
  } catch (e) {
    throw e;
  }
  return compiler.buffer.join('');
}
