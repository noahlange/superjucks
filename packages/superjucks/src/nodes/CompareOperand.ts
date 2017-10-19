import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';

export default class CompareOperandNode extends Node {
  public expr: Node;
  public type: string;
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit(` ${ this.type } `, false);
    compiler.compile(this.expr, frame);
  }
}
