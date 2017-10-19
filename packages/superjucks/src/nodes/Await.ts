import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class AwaitNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    const tok = parser.peekToken();
    let node;
    if (parser.skipValue(Token.SYMBOL, parser.config.syntax.operators.AWAIT)) {
      node = new AwaitNode(tok.line, tok.col, { body: next() });
    } else {
      node = next();
    }
    return node;
  }
  public body: any;
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('await ');
    compiler.compile(this.body, frame);
  }
}
