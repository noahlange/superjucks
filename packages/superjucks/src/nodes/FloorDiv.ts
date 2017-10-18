import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class FloorDivNode extends Node {
  public static parse(parser: Parser, next: () => Node): Node {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, parser.config.syntax.operators.FLOOR_DIV)) {
      node = new FloorDivNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }

  public compile(compiler: Compiler, frame: Frame): void {
    return;
  }
}
