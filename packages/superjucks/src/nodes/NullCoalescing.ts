import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

/**
 * Null-coalescing operator, `??`.
 * ```javascript
 * (VALUE === null || VALUE === undefined) ? DEFAULT_VALUE : VALUE;
 * ```
 */
export default class NullCoalescingNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, '??')) {
      node = new NullCoalescingNode(node.line, node.col, {
        left: node,
        right: next()
      });
    }
    return node;
  }

  public left: Node;
  public right: Node;
  public compile(c: Compiler, frame: Frame) {
    const { left, right } = this;
    c.emit('(', false);
    c.compile(left, frame);
    c.emit(' === null || ', false);
    c.compile(left, frame);
    c.emit(' === undefined) ? ', false);
    c.compile(right, frame);
    c.emit(' : ', false);
    c.compile(left, frame);
  }
}
