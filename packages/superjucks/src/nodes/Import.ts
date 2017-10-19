import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import * as Nodes from './index';

/*
 * Valid syntaxes (basically ES6 imports, aliased named imports excepting)
 * import * as foo from 'bar.sjk';
 * import foo from 'bar.sjk';
 * import { foo, baz } from 'bar.sjk';
 */
export default class ImportNode extends Node {
  public static parse(parser: Parser) {
    const tok = parser.peekToken();
    let imports = null;
    let wildcard = false;

    // there's no case in which this won't be an import token.
    parser.skipValue(Token.SYMBOL, 'import');

    if (parser.skipValue(Token.OPERATOR, '*')) {
      wildcard = true;
      if (!parser.skipValue(Token.SYMBOL, 'as')) {
        throw new Error(
          `parseImport: expected 'as' keyword in 'import *' expression (${tok.line}, ${tok.col})`
        );
      }
    }

    imports = new Nodes.Array(tok.line, tok.col, {
      children: [parser.parseExpression()]
    });

    if (parser.skipValue(Token.COMMA, ',')) {
      if (wildcard) {
        throw new Error(`parseImport: unexpected token comma at (${ tok.line }, ${ tok.col })`);
      }
      imports = new Nodes.Array(tok.line, tok.col, {
        children: [imports.children[0], parser.parseAggregate()]
      });
    }

    if (!parser.skipValue(Token.SYMBOL, 'from')) {
      throw new Error(
        `parseImport: expected 'from' in 'import' expression (${tok.line}, ${tok.col})`
      );
    }

    const template = parser.parseExpression();
    const node = new ImportNode(tok.line, tok.col, { template, imports, wildcard });
    parser.advanceAfterBlockEnd(tok.value);
    return node;
  }

  public template: Nodes.Literal;
  public imports: Nodes.Array;
  public wildcard: boolean;

  public compile() {
    return;
  }
}
