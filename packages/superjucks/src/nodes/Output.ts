import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Literal from './Literal';

export default class OutputNode extends Node {
  public children: Node[];
  public compile(compiler: Compiler, frame: Frame) {
    for (const child of this.children) {
      if (child instanceof Literal) {
        if (child.value) {
          compiler.emitWrite(() => child.compile(compiler, frame));
        }
      } else {
        compiler.emitEscape(() => child.compile(compiler, frame));
      }
    }
  }
}
