import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import * as Nodes from './index';

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
      // we want to make the AST print the expression first, cases second and
      // default case third
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
      node.cases.push(new Nodes.Case(tok.line, tok.col, { cond, body }));
      tok = parser.peekToken();
    } while (tok && tok.value === caseStart);

    switch (tok.value) {
      case caseDefault:
        parser.advanceAfterBlockEnd();
        node.default = parser.parseUntilBlocks(switchEnd);
        parser.advanceAfterBlockEnd();
        break;
      case switchEnd:
        node.default = null;
        parser.advanceAfterBlockEnd();
        break;
      // parser will throw at EOF before we need a default case.
    }

    return node;
  }

  public expr: any;
  public cases: Nodes.Case[];
  public default: Nodes.Aggregate | null;

  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit(`switch (`, false);
    compiler.compile(this.expr, frame);
    compiler.emit(`) {\n`, false);
    compiler.indent(() => {
      for (const c of this.cases) {
        compiler.emit('case ');
        compiler.compile(c.cond, frame);
        compiler.emit(':\n', false);
        compiler.indent(() => {
          c.compile(compiler, frame);
          compiler.emitLine('break;');
        });
      }
      compiler.emit('default:\n');
      compiler.indent(() => {
        if (this.default) {
          compiler.compile(this.default, frame);
        }
        compiler.emitLine('break;');
      });
    });
    compiler.emitLine('}');
  }
}
