import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class TernaryNode extends Node {
  public static parse(parser: Parser, fn: () => Node): Node {
    const node = fn();
    let val = null;
    if (parser.skipValue(Token.OPERATOR, '?')) {
      const body = fn();
      const cond = node;
      val = new TernaryNode(node.line, node.col, { cond, body, else: null });
      val.else = parser.skipValue(Token.COLON, ':') ? fn() : null;
    }
    return val ? val : node;
  }
  public compile() {
    return;
  }
}
