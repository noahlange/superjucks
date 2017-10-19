import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

/**
 * Allows a template to extend a parent template. Usage:
 * ```jinja
 * {% extends 'foo.sjk' %}
 * ```
 */
export default class ExtendsNode extends Node {

  /**
   * Parses an Extends node.
   */
  public static parse(parser: Parser) {
    const name = parser.config.syntax.tags.EXTENDS;
    const tag = parser.peekToken();
    const node = new ExtendsNode(tag.line, tag.col, { template: parser.parseExpression() });
    parser.advanceAfterBlockEnd(tag.value);
    return node;
  }

  /**
   * Compiles an Extends node to JS.
   */
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('parent = await env.getTemplate(');
    compiler.compile(this.template, frame);
    compiler.emit(', true);\n', false);
    compiler.emitLine('parent = await parent.props(env, frame, ctx, runtime);');
    compiler.emitWrite(() => compiler.emit('await parent.render()', false));
  }
}
