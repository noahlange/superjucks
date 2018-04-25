import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import { joinKeywords } from '../utils';

import LiteralNode from './Literal';
import OutputNode from './Output';

export default class RawNode extends Node {

  public static parse(parser: Parser) {
    const tag = parser.config.syntax.tags.RAW;
    const end = parser.config.syntax.keywords.END + tag;
    const { BLOCK_END, BLOCK_START } = parser.lexer.tags;
    const regexp = new RegExp(
      `([\\s\\S]*?)${BLOCK_START}-?\\s*(${tag}|${end})\\s*-?(?=${BLOCK_END})${BLOCK_END}`
    );
    const first = parser.advanceAfterBlockEnd();
    let matches = parser.lexer.remainder.match(regexp);
    let [ all, pre, block ] = matches;
    parser.lexer.forwardN(all.length);
    let value = '';
    let level = 1;

    do {
      [ all, pre, block ] = matches;
      // adjust nesting level
      level += block === tag ? 1 : block === end ? -1 : 0;
      // back to the beginning of the raw block
      parser.lexer.backN(level === 0 ? all.length - pre.length : 0);
      // add to string
      value += (level === 0) ? pre : all;
      matches = parser.lexer.remainder.match(regexp);
      if (matches) {
        parser.lexer.forwardN(matches[0].length);
      }
    } while (matches && level > 0);

    return new OutputNode(first.line, first.col, {
      children: [
        new LiteralNode(first.line, first.col, { value })
      ]
    });
  }

  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
