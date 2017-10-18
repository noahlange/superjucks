import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class DivNode extends Node {
  public static parse(parser: Parser, next: () => Node): Node {
    let node = next();
    while (parser.skipValue(Token.OPERATOR, parser.config.syntax.operators.DIV)) {
      node = new DivNode(node.line, node.col, { left: node, right: next() });
    }
    return node;
  }

  public compile(compiler: Compiler, frame: Frame): void {
    return;
  }
}
