import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

/**
 * Logical inverse of If node.
 * ```jinja2
 * {% unless foo %}
 *   {{ bar }}
 * {% endunless %}
 * ```
 */
export default class UnlessNode extends Node {
  public static parse(parser: Parser) {
    const start = parser.config.syntax.tags.UNLESS;
    const end = `${parser.config.syntax.keywords.END}${start}`;
    const tag = parser.peekToken();
    parser.skipValue(Token.SYMBOL, start);
    const node = new UnlessNode(tag.line, tag.col, {
      body: null,
      cond: parser.parseExpression()
    });
    parser.advanceAfterBlockEnd(tag.value);
    node.body = parser.parseUntilBlocks(end);
    parser.advanceAfterBlockEnd();
    return node;
  }

  public cond: Node;
  public body: Node;
  public fields = ['cond', 'body'];

  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('if (!(');
    this.cond.compile(compiler, frame);
    compiler.emit(')) {\n', false);
    compiler.indent(() => compiler.compile(this.body, frame));
    compiler.emit('}', false);
  }
}
