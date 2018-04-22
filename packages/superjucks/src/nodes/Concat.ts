import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class ConcatNode extends Node {
  public static parse(parser: Parser, next: () => Node): Node {
    let node = next();
    while (parser.skipValue(Token.TILDE, parser.config.syntax.operators.CONCAT)) {
      node = new ConcatNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }

  public compile(compiler: Compiler, frame: Frame): void {
    compiler.emit('`${', false);
    compiler.compile(this.left, frame);
    compiler.emit('}`', false);
    compiler.emit(' + ', false);
    compiler.emit('`${', false);
    compiler.compile(this.right, frame);
    compiler.emit('}`', false);
  }
}
