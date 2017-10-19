import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import ArrayNode from './Array';
import DictNode from './Dict';
import PairNode from './Pair';
import SymbolNode from './Symbol';

export default class ExportNode extends Node {
  public static parse(parser: Parser) {
    const tag = parser.config.syntax.tags.EXPORT;
    const tok = parser.peekToken();
    let exports;
    if (!parser.skipValue(Token.SYMBOL, tag)) {
      throw new Error(`parser: expected "${ tag }" at (${ tok.line }, ${ tok.col })`);
    }
    if (parser.skipValue(Token.SYMBOL, parser.config.syntax.keywords.DEFAULT)) {
      const next = parser.peekToken();
      const pair = new PairNode(next.line, next.col, {
        key: new SymbolNode(next.line, next.col, { value: 'default' }),
        value: parser.parseExpression()
      });
      exports = new DictNode(next.line, next.col, { children: [ pair ] });
    } else {
      exports = parser.parseExpression();
    }
    const node = new ExportNode(tok.line, tok.col, { exports });

    parser.advanceAfterBlockEnd(tag);
    return node;
  }

  public exports: ArrayNode;

  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
