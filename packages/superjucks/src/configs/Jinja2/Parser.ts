import Lexer, { Token } from '../../Lexer';
import Node from '../../Node';
import * as Nodes from '../../nodes/index';
import Parser from '../../Parser';
import KeywordArgs from './nodes/KeywordArgs';
import Slice from './nodes/Slice';

function getLexerState(lexer: Lexer) {
  const { col, index, line } = lexer;
  return { col, index, line };
}

export default class JinjaParser extends Parser {

  /**
   * Updated to support Array slicing.
   */
  public parseAggregate() {
    const curr = getLexerState(this.lexer);
    curr.col--;
    curr.index--;
    curr.line = curr.line;
    try {
      return super.parseAggregate();
    } catch (e) {
      const rethrow = () => e;
      const err = getLexerState(this.lexer);
      Object.assign(this.lexer, curr);
      this.peeked = null;
      const tok = this.peekToken();
      if (tok.type !== Token.LEFT_BRACKET) {
        throw rethrow();
      } else {
        this.nextToken();
      }
      const node = new Slice(tok.line, tok.col, {
        start: null,
        step: null,
        stop: null
      });
      let isSlice = false;
      for (const field of node.fields) {
        if (this.skip(Token.RIGHT_BRACKET)) {
          break;
        }
        if (this.skip(Token.COLON)) {
          isSlice = true;
        } else {
          node[field] = this.parseExpression();
          isSlice = this.skip(Token.COLON) || isSlice;
        }
      }
      if (!isSlice) {
        throw rethrow();
      }
      return new Nodes.Array(tok.line, tok.col, { children: [node] });
    }
  }

  public parseSignature(tolerant?: boolean, noParens?: boolean) {
    let tok = this.peekToken();
    if (!noParens && tok.type !== Token.LEFT_PAREN) {
      if (tolerant) {
        return null;
      } else {
        throw new Error(`Expected arguments (${tok.line}, ${tok.col})`);
      }
    }
    if (tok.type === Token.LEFT_PAREN) {
      tok = this.nextToken();
    }

    const args = new Nodes.List(tok.line, tok.col, { children: [] });
    const kwargs = new KeywordArgs(tok.line, tok.col, { children: [] });

    while (true) {
      tok = this.peekToken();
      if (!noParens && tok.type === Token.RIGHT_PAREN) {
        this.nextToken();
        break;
      } else if (noParens && tok.type === Token.BLOCK_END) {
        break;
      }

      this.skip(Token.COMMA);
      const arg = this.parseExpression();
      if (this.skipValue(Token.OPERATOR, '=')) {
        kwargs.addChild(
          new Nodes.Pair(arg.line, arg.col, {
            left: arg,
            right: this.parseExpression()
          })
        );
      } else {
        args.addChild(arg);
      }
    }
    if (kwargs.children.length) {
      args.addChild(kwargs);
    }

    return args;
  }

  /**
   * We need to ensure that JS literals are translated
   * to their Python counterparts.
   */
  public parsePrimary(noPostfix?: boolean): Node {
    let value;
    const tok = this.nextToken();

    switch (tok.type) {
      case Token.SYMBOL:
        switch (tok.value) {
          // True === true
          case 'True':
            value = true;
            break;
          // False === false
          case 'False':
            value = false;
            break;
          // None === null
          case 'None':
            value = null;
            break;
        }
        break;
    case (Token.BOOLEAN):
      switch (tok.value) {
        // true === 'true'
        case 'true':
          value = 'true';
          break;
        // false === 'false'
        case 'false':
          value = 'false';
          break;
      }
      break;
    case (Token.NULL):
      // null === 'null'
      value = 'null';
      break;
    }

    if (value === undefined) {
      // push the token back onto the stack
      this.pushToken(tok);
      // and return whatever the original parser would have.
      return super.parsePrimary(noPostfix);
    } else if (tok.type === Token.SYMBOL) {
      return new Nodes.Literal(tok.line, tok.col, { value });
    } else if (tok.type === Token.BOOLEAN || tok.type === Token.NULL) {
      // return a symbol (i.e., variable) for booleans and nulls
      return new Nodes.Symbol(tok.line, tok.col, { value });
    }
    throw new Error('What are YOU doing here?! 🐴');
  }
}
