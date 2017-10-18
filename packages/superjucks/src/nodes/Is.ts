import Compiler from '../Compiler';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import NotNode from './Not';

export default class IsNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    const is = parser.skipValue(Token.SYMBOL, 'is');
    if (is) {
      const not = parser.skipValue(Token.SYMBOL, 'not');
      node = new IsNode(node.line, node.col, { left: node, right: next() });
      if (not) {
        node = new NotNode(node.line, node.col, { body: node });
      }
    }
    return node;
  }
  public compile() {
    return;
  }
}
