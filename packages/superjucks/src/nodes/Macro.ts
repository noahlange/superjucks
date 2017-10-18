import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import ListNode from './List';

export default class MacroNode extends Node {
  public static parse(parser: Parser) {
    const macroTok = parser.peekToken();
    if (!parser.skipValue(Token.SYMBOL, 'macro')) {
      throw new Error('Expected macro');
    }

    const name = parser.parsePrimary(true);
    const args = parser.parseSignature();
    const node = new MacroNode(macroTok.line, macroTok.col, { name, args });

    parser.advanceAfterBlockEnd(macroTok.value);
    node.body = parser.parseUntilBlocks('endmacro');
    parser.advanceAfterBlockEnd();

    return node;
  }

  public name: any;
  public args: ListNode;
  public body: any;
  public rendered = false;
  public compile() {
    return;
  }
}
