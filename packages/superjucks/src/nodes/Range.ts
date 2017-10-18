import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class RangeNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    if (parser.skipValue(Token.OPERATOR, '...')) {
      node = new RangeNode(node.line, node.col, { left: node, right: next(), exclusive: true });
    } else if (parser.skipValue(Token.OPERATOR, '..')) {
      node = new RangeNode(node.line, node.col, { left: node, right: next(), exclusive: false });
    }
    return node;
  }

  public exclusive: boolean;
  public left: any;
  public right: any;
  public compile() {
    return;
  }
}
