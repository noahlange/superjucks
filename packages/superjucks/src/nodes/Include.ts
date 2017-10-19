import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

export default class IncludeNode extends Node {
  public static parse(parser: Parser) {
    const tag = parser.peekToken();
    if (!parser.skipValue(Token.SYMBOL, 'include')) {
      throw new Error(
        `parseInclude: expected include (${tag.line}, ${tag.col})`
      );
    }
    const node = new IncludeNode(tag.line, tag.col, {
      template: parser.parseExpression()
    });
    if (
      parser.skipValue(Token.SYMBOL, 'ignore') &&
      parser.skipValue(Token.SYMBOL, 'missing')
    ) {
      node.ignoreMissing = true;
    }
    if (parser.skipValue(Token.SYMBOL, 'with')) {
      node.with = parser.parseExpression();
    }
    parser.advanceAfterBlockEnd(tag.value);
    return node;
  }

  public template: Node;
  public with: Node;
  public ignoreMissing: boolean;

  public compile(compiler: Compiler, frame: Frame) {
    const tmp = compiler.id();
    compiler.emit(`let ${tmp} = await env.getTemplate(`);
    compiler.compile(this.template, frame);
    compiler.emit(
      `, true, ${compiler.template ? `'${compiler.template}'` : null});\n`,
      false
    );
    compiler.emitWrite(() =>
      compiler.emit(`await ${tmp}.render(ctx.getVariables(), frame)`, false)
    );
  }
}
