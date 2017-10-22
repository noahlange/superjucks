import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class MulNode extends Node {

  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, '*')) {
      node = new MulNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }

  public left: Node;
  public right: Node;

  public compile(compiler: Compiler, frame: Frame): void {
    compiler.compile(this.left, frame);
    compiler.emit(' * ', false);
    compiler.compile(this.right, frame);
  }
}
