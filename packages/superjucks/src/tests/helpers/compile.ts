import Compiler from '../../Compiler';
import Frame from '../../Frame';
import { parse } from '../../Parser';

export default function compile(ast?: any, frame = new Frame()): Promise<string> {
  return new Promise((resolve, reject) => {
    const compiler = new Compiler();
    compiler.compile(ast, frame)
      .then(() => resolve(compiler.buffer.join('')))
      .catch(reject);
  });
}
