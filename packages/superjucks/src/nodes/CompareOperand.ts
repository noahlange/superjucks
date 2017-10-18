import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';

export default class CompareOperandNode extends Node {
  public expr: Node;
  public type: Token;
  public compile() {
    return;
  }
}
