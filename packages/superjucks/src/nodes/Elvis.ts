import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

/**
 * Elvis operator, `?:`, approximately equivalent to A ? A : B;
 * ```javascript
 * (A !== null && A !== undefined && A !== false ? A : B;
 * ```
 */
export default class Elvis extends Node {

  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, parser.config.syntax.operators.ELVIS)) {
      node = new Elvis(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }

  public left: Node;
  public right: Node;
  public compile(c: Compiler, frame: Frame) {
    const { left, right } = this;
    c.emit('(', false);
    c.compile(left, frame);
    c.emit(' || ', false);
    c.compile(right, frame);
    c.emit(')', false);
  }
}
