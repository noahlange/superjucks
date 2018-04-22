import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import NotNode from './Not';

export default class InNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    let tok;
    let invert;
    while (true) {
      // check if the next token is 'not'
      tok = parser.nextToken();
      invert = (tok.type === Token.SYMBOL && tok.value === 'not');
      // if it wasn't 'not', put it back
      if (!invert) {
        parser.pushToken(tok);
      }
      if (parser.skipValue(Token.SYMBOL, 'in')) {
        node = new InNode(node.line, node.col, { left: node, right: next() });
        if (invert) {
          node = new NotNode(node.line, node.col, { body: node });
        }
      } else {
        // if we'd found a 'not' but this wasn't an 'in', put back the 'not'
        if (invert) {
          parser.pushToken(tok);
        }
        break;
      }
    }
    return node;
  }
  public compile(compiler: Compiler, frame: Frame): void {
    compiler.emit('lib.contains(', false);
    compiler.compile(this.right, frame);
    compiler.emit(', ', false);
    compiler.compile(this.left, frame);
    compiler.emit(')', false);
  }
}
