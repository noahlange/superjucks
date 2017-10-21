import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class OrNode extends Node {
  public static parse(parser: Parser, next: () => Node): Node {
    let node = next();
    while (parser.skipValue(Token.SYMBOL, 'or')) {
      node = new OrNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }
  public compile(compiler: Compiler, frame: Frame) {
    compiler.compile(this.left, frame);
    compiler.emit(' || ', false);
    compiler.compile(this.right, frame);
  }
}
