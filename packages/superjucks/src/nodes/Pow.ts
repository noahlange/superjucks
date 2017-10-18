import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class PowNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, '**')) {
      node = new PowNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }
  public left: any;
  public right: any;
  public compile() {
    return;
  }
}
