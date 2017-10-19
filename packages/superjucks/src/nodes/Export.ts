import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import * as Nodes from './index';

export default class ExportNode extends Node {
  public static parse(parser: Parser) {
    const tag = parser.config.syntax.tags.EXPORT;
    const tok = parser.peekToken();
    parser.skipValue(Token.SYMBOL, tag);
    let exports;
    if (parser.skipValue(Token.SYMBOL, parser.config.syntax.keywords.DEFAULT)) {
      const next = parser.peekToken();
      const pair = new Nodes.Pair(next.line, next.col, {
        key: new Nodes.Symbol(next.line, next.col, { value: 'default' }),
        value: parser.parseExpression()
      });
      exports = new Nodes.Dict(next.line, next.col, { children: [ pair ] });
    } else {
      exports = parser.parseExpression();
    }
    const node = new ExportNode(tok.line, tok.col, { exports });

    parser.advanceAfterBlockEnd(tag);
    return node;
  }

  public exports: Nodes.Array;

  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
