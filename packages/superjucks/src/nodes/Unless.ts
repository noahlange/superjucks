import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class UnlessNode extends Node {
  public static parse(parser: Parser) {
    const start = parser.config.syntax.tags.UNLESS;
    const end = `${ parser.config.syntax.keywords.END }${ start }`;
    const tag = parser.peekToken();
    let node;
    if (parser.skipValue(Token.SYMBOL, start)) {
      node = new UnlessNode(tag.line, tag.col, { cond: null, body: null });
    } else {
      throw new Error(`parseUnless: expected "${ start }" at (${ tag.line }, ${ tag.col })`);
    }

    node.cond = parser.parseExpression();
    parser.advanceAfterBlockEnd(tag.value);
    node.body = parser.parseUntilBlocks(end);
    parser.advanceAfterBlockEnd();
    return node;
  }

  public cond: Node | null;
  public body: Node | null;
  public compile() {
    return;
  }
}
