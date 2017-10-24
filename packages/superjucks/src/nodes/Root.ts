import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class RootNode extends Node {
  public compile(compiler: Compiler) {
    const frame = new Frame();
    compiler.emitLine('return async lib => {');
    compiler.indent(() => {
      compiler.emitLine('const buffer = lib.buffer;');
      for (const child of this.children) {
        child.compile(compiler, frame);
      }
      compiler.emitLine('return buffer.out();');
    });
    compiler.emitLine('}');
  }
}
