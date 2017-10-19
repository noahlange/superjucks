import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class AddNode extends Node {

  public static parse(parser: Parser, next: () => Node): Node {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, parser.config.syntax.operators.PLUS)) {
      node = new AddNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }

  public left: Node;
  public right: Node;

  public compile(compiler: Compiler, frame: Frame): void {
    compiler.compile(this.left, frame);
    compiler.emit(' + ', false);
    compiler.compile(this.right, frame);
  }
}
