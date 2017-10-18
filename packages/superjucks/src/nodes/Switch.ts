import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import CaseNode from './Case';

export default class SwitchNode extends Node {
  public static parse(parser: Parser) {
    const switchStart = parser.config.syntax.tags.SWITCH;
    const switchEnd = parser.config.syntax.keywords.END + switchStart;
    const caseStart = parser.config.syntax.tags.CASE;
    const caseDefault = parser.config.syntax.tags.DEFAULT;
    const tag = parser.peekToken();

    parser.skipValue(Token.SYMBOL, switchStart);
    const node = new SwitchNode(tag.line, tag.col, {
      expr: parser.parseExpression(),
      // tslint:disable-next-line object-literal-sort-keys
      cases: [],
      default: null
    });

    parser.advanceAfterBlockEnd(switchStart);
    parser.parseUntilBlocks(caseStart, caseDefault, switchEnd);
    let tok = parser.peekToken();
    do {
      parser.skipValue(Token.SYMBOL, caseStart);
      const cond = parser.parseExpression();
      parser.advanceAfterBlockEnd(caseStart);
      const body = parser.parseUntilBlocks(caseStart, caseDefault, switchEnd);
      node.cases.push(new CaseNode(tok.line, tok.col, { cond, body }));
      tok = parser.peekToken();
    } while (tok && tok.value === caseStart);

    switch (tok.value) {
      case caseDefault:
        parser.advanceAfterBlockEnd();
        node.default = parser.parseUntilBlocks(switchEnd);
        parser.advanceAfterBlockEnd();
        break;
      case switchEnd:
        node.default = undefined;
        parser.advanceAfterBlockEnd();
        break;
      default:
        // parser will throw at EOF before the switch does.
        return;
    }

    return node;
  }

  public expr: any;
  public cases: CaseNode[];
  public default: any;

  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
