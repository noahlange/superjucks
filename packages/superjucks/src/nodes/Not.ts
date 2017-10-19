import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class NotNode extends Node {
  public static parse(parser: Parser, next: () => Node): Node {
    const tok = parser.peekToken();
    return parser.skipValue(Token.SYMBOL, 'not')
      ? new NotNode(tok.line, tok.col, { body: this.parse(parser, next) })
      : next();
  }
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('!(', false);
    compiler.compile(this.body, frame);
    compiler.emit(')', false);
  }
}
