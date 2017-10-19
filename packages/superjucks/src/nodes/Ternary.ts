import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class TernaryNode extends Node {
  public static parse(parser: Parser, next: () => Node): Node {
    const node = next();
    let val = null;
    if (parser.skipValue(Token.OPERATOR, '?')) {
      const body = next();
      const cond = node;
      val = new TernaryNode(node.line, node.col, { cond, body, else: null });
      val.else = parser.skipValue(Token.COLON, ':') ? next() : null;
    }
    return val ? val : node;
  }

  public compile(compiler: Compiler, frame: Frame) {
    this.cond.compile(compiler, frame);
    compiler.emit(' ? ', false);
    this.body.compile(compiler, frame);
    compiler.emit(' : ', false);
    if (this.else) {
      this.else.compile(compiler, frame);
    } else {
      compiler.emit(`''`);
    }
  }
}
