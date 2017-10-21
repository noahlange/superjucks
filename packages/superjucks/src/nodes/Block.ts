import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Parser from '../Parser';

import Node from '../Node';
import ListNode from './List';
import SymbolNode from './Symbol';

export default class BlockNode extends Node {
  public static parse(parser: Parser) {
    const start = parser.config.syntax.tags.BLOCK;
    const end = `${parser.config.syntax.keywords.END}${start}`;

    const tag = parser.peekToken();
    parser.skipValue(Token.SYMBOL, start);

    const name = parser.parsePrimary();
    const node = new BlockNode(tag.line, tag.col, { name, body: null });

    if (!(node.name instanceof SymbolNode)) {
      throw new Error(
        `parseBlock: expected symbol, found "${ name.value }" (${tag.line}, ${tag.col})`
      );
    }

    parser.advanceAfterBlockEnd(tag.value);
    node.body = parser.parseUntilBlocks(end);
    parser.skipValue(Token.SYMBOL, end);
    parser.skipValue(Token.SYMBOL, node.name.value);

    const tok = parser.peekToken();
    if (!tok) {
      throw new Error(`parseBlock: expected "${end}", got end of file`);
    }

    parser.advanceAfterBlockEnd(tok.value);

    return node;
  }

  public name: SymbolNode;
  public body: ListNode;
  public compile() {
    return;
  }
}
