import { Token } from '../Lexer';
import Node from '../Node';
import * as Nodes from '../nodes/index';
import Parser from '../Parser';

export default class ForNode extends Node {
  public static parse(parser: Parser) {
    const { keywords, operators, tags } = parser.config.syntax;
    const start = tags.FOR;
    const end = keywords.END + tags.FOR;

    const forTok = parser.peekToken();
    parser.skipValue(Token.SYMBOL, start);

    const node = new ForNode(forTok.line, forTok.col, {});
    node.fields = [ 'iterable', 'name', 'body', 'else', 'async' ];
    if (parser.skipValue(Token.SYMBOL, operators.AWAIT)) {
      node.async = true;
    }

    node.name = parser.parsePrimary();

    if (!(node.name instanceof Nodes.Symbol
      || node.name instanceof Nodes.Dict
      || node.name instanceof Nodes.Array)) {
      throw new Error('parseFor: variable or destructuring assignment expected for loop');
    }

    const type = parser.peekToken().type;
    if (type === Token.COMMA) {
      // key/value iteration
      const key = node.name;
      node.name = new Nodes.Array(key.line, key.col, { children: [ key ] });
      while (parser.skip(Token.COMMA)) {
        const prim = parser.parsePrimary();
        node.name.addChild(prim);
      }
    }

    if (!parser.skipValue(Token.SYMBOL, keywords.OF)) {
      const msg = `parseFor: expected "${ keywords.OF }" keyword in for loop at` +
       `(${ forTok.line }, ${ forTok.col })`;
      throw new Error(msg);
    }

    node.iterable = parser.parseExpression();

    parser.advanceAfterBlockEnd(forTok.value);
    node.body = parser.parseUntilBlocks(end, 'else');
    if (parser.skipValue(Token.SYMBOL, tags.ELSE)) {
      parser.advanceAfterBlockEnd(tags.ELSE);
      node.else = parser.parseUntilBlocks(end);
    }
    parser.advanceAfterBlockEnd();
    return node;
  }

  public async: boolean;
  public iterable: Node;
  public name: Node;
  public body: Node;
  public else: Node;

  public compile() {
    return;
  }
}
