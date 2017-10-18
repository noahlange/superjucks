import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import * as Nodes from './index';

export default class CompareNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    const syntax = parser.config.syntax;
    const compareOps = {
      [syntax.operators.EQ]: '==',
      [syntax.operators.EQ_STRICT]: '===',
      [syntax.operators.NEQ]: '!=',
      [syntax.operators.NEQ_STRICT]: '!==',
      [syntax.operators.LT]: '<',
      [syntax.operators.GT]: '>',
      [syntax.operators.LTE]: '<=',
      [syntax.operators.GTE]: '>='
    };
    const expr = next();
    const ops: Nodes.CompareOperand[] = [];
    while (true) {
      const tok = parser.nextToken();
      if (!tok) {
        break;
      } else if (compareOps[tok.value]) {
        ops.push(
          new Nodes.CompareOperand(tok.line, tok.col, {
            expr: next(),
            type: compareOps[tok.value]
          })
        );
      } else {
        parser.pushToken(tok);
        break;
      }
    }
    if (ops.length) {
      return new CompareNode(ops[0].line, ops[0].col, { expr, ops });
    } else {
      return expr;
    }
  }

  public expr: any;
  public ops: Nodes.CompareOperand[];

  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
