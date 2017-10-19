import Config from './Config';
import Superjucks from './configs/Superjucks/Config';
import Lexer, { IToken, lex, Token } from './Lexer';
import Node from './Node';
import * as Nodes from './nodes/index';

export function parse(
  src: string,
  preset: Config = new Superjucks(),
  opts?: any
) {
  const config = preset || new Superjucks();
  const lexer = lex(src, opts);
  const parser = new Parser(lexer, config, opts);
  return parser.parseAsRoot();
}

export default class Parser {
  public breakOnBlocks: any[] | null;
  public lexer: Lexer;
  public config: Config;
  // will assert the existence of filters, tests and globals in the sandbox
  public strict: boolean = true;
  protected peeked: IToken | null = null;
  protected dropLeadingWhitespace: boolean;

  public skipValue(type: Token, value: any): boolean {
    const tok = this.nextToken() as IToken;
    if (!tok || tok.type !== type || tok.value !== value) {
      this.pushToken(tok);
      return false;
    }
    return true;
  }

  public parseUntilBlocks(...blockNames: any[]) {
    const prev = this.breakOnBlocks;
    this.breakOnBlocks = blockNames;
    const ret = new Nodes.List(0, 0, { children: this.parseNodes() });
    this.breakOnBlocks = prev;
    return ret;
  }

  public parseSignature(tolerant?: boolean, noParens?: boolean) {
    let tok = this.peekToken() as IToken;
    if (!noParens && tok.type !== Token.LEFT_PAREN) {
      if (tolerant) {
        return null;
      } else {
        throw new Error(`expected arguments (${tok.line}, ${tok.col})`);
      }
    }
    if (tok.type === Token.LEFT_PAREN) {
      tok = this.nextToken() as IToken;
    }

    const args = new Nodes.List(tok.line, tok.col, { children: [] });

    while (true) {
      tok = this.peekToken() as IToken;
      if (!noParens && tok.type === Token.RIGHT_PAREN) {
        this.nextToken();
        break;
      } else if (noParens && tok.type === Token.BLOCK_END) {
        break;
      }

      this.skip(Token.COMMA);
      let arg = this.parseExpression();
      if (this.skipValue(Token.OPERATOR, '=')) {
        arg = new Nodes.Assign(tok.line, tok.col, {
          target: arg,
          value: this.parseExpression()
        });
      }
      args.addChild(arg);
    }

    return args;
  }

  public pushToken(tok: IToken): void {
    if (this.peeked) {
      throw new Error('pushToken: can only push one token on between reads');
    }
    this.peeked = tok;
  }

  public skip(type: Token): boolean {
    const tok = this.nextToken() as IToken;
    if (!tok || tok.type !== type) {
      this.pushToken(tok);
      return false;
    }
    return true;
  }

  public parseAggregate() {
    const tok = this.nextToken();
    let node;

    switch (tok.type) {
      case Token.LEFT_PAREN:
        node = new Nodes.List(tok.line, tok.col, { children: [] });
        break;
      case Token.LEFT_BRACKET:
        node = new Nodes.Array(tok.line, tok.col);
        break;
      case Token.LEFT_CURLY:
        node = new Nodes.Dict(tok.line, tok.col);
        break;
      default:
        return null;
    }

    while (true) {
      const type = this.peekToken().type;
      if (
        type === Token.RIGHT_PAREN ||
        type === Token.RIGHT_BRACKET ||
        type === Token.RIGHT_CURLY
      ) {
        this.nextToken();
        break;
      }
      if (node.children && node.children.length > 0) {
        if (!this.skip(Token.COMMA)) {
          throw new Error(
            `parseAggregate: expected comma after expression (${tok.line}, ${tok.col}), found "${ tok.value }"`
          );
        }
      }
      if (node instanceof Nodes.Dict) {
        // TODO: check for errors
        const key = this.parsePrimary();
        // we expect a key/value pair for dicts, separated by a colon
        if (!this.skip(Token.COLON)) {
          node.addChild(key);
        } else {
          // TODO: check for errors
          const value = this.parseExpression();
          node.addChild(new Nodes.Pair(key.line, key.col, { key, value }));
        }
      } else {
        // TODO: check for errors
        const expr = this.parseExpression();
        node.addChild(expr);
      }
    }

    return node;
  }

  public parsePostfix(node: Node) {
    let tok = this.peekToken() as IToken;
    let lookup;
    while (tok) {
      if (tok.type === Token.LEFT_PAREN) {
        // Function call
        node = new Nodes.FunctionCall(tok.line, tok.col, { name: node, args: this.parseSignature(), });
      } else if (tok.type === Token.LEFT_BRACKET) {
        // Reference
        lookup = this.parseAggregate();
        if (lookup && lookup.children && lookup.children.length > 1) {
          throw new Error(`Invalid index at (${tok.line}, ${tok.col})`);
        }
        node = new Nodes.LookupVal(tok.line, tok.col, {
          target: node,
          value: lookup!.children[0]
        });
      } else if (tok.type === Token.OPERATOR && tok.value === '.') {
        // Reference
        this.nextToken();
        const val = this.nextToken() as IToken;
        if (val.type !== Token.SYMBOL) {
          throw new Error(
            `Expected name as lookup value, got ${val.value} (${val.line}, ${val.col})`
          );
        }
        // Make a literal string because it's not a variable reference
        const literal = new Nodes.Literal(val.line, val.col, {
          value: val.value
        });
        node = new Nodes.LookupVal(tok.line, tok.col, {
          target: node,
          value: literal
        });
      } else {
        break;
      }
      tok = this.peekToken();
    }
    return node;
  }

  public parsePrimary(noPostfix?: boolean): Node {
    const tok = this.nextToken();
    let node: Node | null;
    let val;
    if (!tok) {
      throw new Error('expected expression, got end of file');
    }

    switch (tok.type) {
      case Token.STRING:
        val = tok.value;
        break;
      case Token.INT:
        val = parseInt(tok.value, 10);
        break;
      case Token.FLOAT:
        val = parseFloat(tok.value);
        break;
      case Token.BOOLEAN:
        if (tok.value === 'true') {
          val = true;
        } else if (tok.value === 'false') {
          val = false;
        } else {
          throw new Error(`Invalid boolean (${tok.line}, ${tok.col})`);
        }
        break;
      case Token.NULL:
        val = null;
        break;
      case Token.REGEX:
        val = new RegExp(tok.value.body, tok.value.flags);
        break;
    }

    if (val !== undefined) {
      node = new Nodes.Literal(tok.line, tok.col, { value: val });
    } else if (tok.type === Token.SYMBOL) {
      node = new Nodes.Symbol(tok.line, tok.col, { value: tok.value });
    } else {
      // See if it's an aggregate type, we need to push the
      // current delimiter token back on
      this.pushToken(tok);
      node = this.parseAggregate();
    }
    if (!noPostfix && node) {
      node = this.parsePostfix(node);
    }
    if (node) {
      return node;
    } else {
      throw new Error(
        `Unexpected ${ Token[tok.type] } "${tok.value}" (${tok.line}, ${tok.col})`
      );
    }
  }

  public parseExpression() {
    const fns = (this.config.operators || [])
      .slice()
      .concat([this.parsePrimary]);
    let res;
    do {
      const fn = fns.pop();
      const prev = res;
      res = () => (fn.parse ? fn.parse.call(fn, this, prev) : fn.call(this));
    } while (fns.length);
    return res();
  }

  public parseStatement() {
    const tok = this.peekToken() as IToken;
    const nodes = this.config.tags as any;

    if (tok.type !== Token.SYMBOL) {
      throw new Error(`tag name "${ tok.value }" expected (${tok.line}, ${tok.col})`);
    }

    if (this.breakOnBlocks && this.breakOnBlocks.indexOf(tok.value) !== -1) {
      return null;
    }

    const cased = tok.value[0].toUpperCase() + tok.value.slice(1);
    const node = nodes[cased];
    if (node) {
      if (node.parseBlock) {
        return node.parseBlock(this);
      } else if (node.parse) {
        return node.parse(this);
      }
    } else {
      throw new Error(
        `Unknown block tag ${tok.value} (${tok.line}, ${tok.col})`
      );
    }
  }

  public nextToken(whitespace?: boolean): IToken {
    let tok;
    if (this.peeked) {
      if (!whitespace && this.peeked.type === Token.WHITESPACE) {
        this.peeked = null;
      } else {
        tok = this.peeked;
        this.peeked = null;
        return tok;
      }
    }
    tok = this.lexer.nextToken();
    if (!whitespace) {
      while (tok && tok.type === Token.WHITESPACE) {
        tok = this.lexer.nextToken();
      }
    }
    return tok as IToken;
  }

  public parseNodes() {
    const buffer = [];
    let tok = this.nextToken();
    while (tok) {
      if (tok.type === Token.DATA) {
        let data = tok.value;
        const nextToken = this.peekToken();
        const nextVal = nextToken && nextToken.value;
        // If the last token has "-" we need to trim the
        // leading whitespace of the data. This is marked with
        // the `dropLeadingWhitespace` variable.

        if (this.dropLeadingWhitespace) {
          // TODO: this could be optimized (don't use regex)
          data = data.replace(/^\s*/, '');
          this.dropLeadingWhitespace = false;
        }
        // Same for the succeding block start token
        const { VARIABLE_START, COMMENT_START } = this.lexer.tags;
        if (
          nextToken &&
          ((nextToken.type === Token.BLOCK_START &&
            nextVal.charAt(nextVal.length - 1) === '-') ||
            (nextToken.type === Token.VARIABLE_START &&
              nextVal.charAt(VARIABLE_START.length) === '-') ||
            (nextToken.type === Token.COMMENT &&
              nextVal.charAt(COMMENT_START.length) === '-'))
        ) {
          // TODO: this could be optimized (don't use regex)
          data = data.replace(/\s*$/, '');
        }
        buffer.push(
          new Nodes.Output(tok.line, tok.col, {
            children: [new Nodes.Literal(tok.line, tok.col, { value: data })]
          })
        );
      } else if (tok.type === Token.BLOCK_START) {
        this.dropLeadingWhitespace = false;
        const n = this.parseStatement();
        if (!n) {
          break;
        }
        buffer.push(n);
      } else if (tok.type === Token.VARIABLE_START) {
        const exp = this.parseExpression();
        this.dropLeadingWhitespace = false;
        this.advanceAfterVariableEnd();
        buffer.push(new Nodes.Output(tok.line, tok.col, { children: [exp] }));
      } else if (tok.type === Token.COMMENT) {
        const possibleDash = tok.value.charAt(
          tok.value.length - this.lexer.tags.COMMENT_END.length - 1
        );
        this.dropLeadingWhitespace = possibleDash === '-';
      } else {
        // Ignore comments, otherwise this should be an error
        throw new Error(
          `Unexpected token at top-level: ${Token[
            tok.type
          ]} (${tok.line}, ${tok.col})`
        );
      }
      tok = this.nextToken() as IToken;
    }
    return buffer;
  }

  public advanceAfterBlockEnd(name?: string) {
    let tok;
    if (!name) {
      tok = this.peekToken();
      if (!tok) {
        throw new Error('unexpected end of file');
      }
      if (tok.type !== Token.SYMBOL) {
        throw new Error(
          'advanceAfterBlockEnd: expected symbol token or explicit name to be passed'
        );
      }
      const nextToken = this.nextToken();
      if (!nextToken) {
        throw new Error('unexpected EOF');
      } else {
        name = nextToken.value;
      }
    }
    tok = this.nextToken();
    if (tok && tok.type === Token.BLOCK_END) {
      if (tok.value.charAt(0) === '-') {
        this.dropLeadingWhitespace = true;
      }
    } else {
      const { line, col, value } = tok;
      const type = Token[tok.type].toLowerCase();
      throw new Error(`Expected end of tag "${name}" at ${line}, ${col}, found ${ type } "${ value }"`);
    }
    return tok;
  }

  public advanceAfterVariableEnd() {
    const tok = this.nextToken();
    if (tok && tok.type === Token.VARIABLE_END) {
      const len: number = this.lexer.tags.VARIABLE_END.length;
      this.dropLeadingWhitespace =
        tok.value.charAt(tok.value.length - len - 1) === '-';
    } else {
      const err = this.nextToken();
      throw new Error(
        `Unexpected ${Token[
          tok.type
        ].toLowerCase()} "${tok.value}" at ${err.line}, ${err.col}; expected variable end.`
      );
    }
  }

  public matches(value: string, tags: string | string[]) {
    const arr = Array.isArray(tags) ? tags : [ tags ];
    for (const tag of arr) {
      if (value === tag) {
        return true;
      }
    }
    return false;
  }

  public peekToken(): IToken {
    this.peeked = this.peeked || this.nextToken();
    return this.peeked;
  }

  public parseAsRoot() {
    const children = this.parseNodes();
    return new Nodes.Root(0, 0, { children });
  }

  public constructor(
    lexer: Lexer,
    config: Config,
    opts: any = { strict: true }
  ) {
    this.strict = !!opts.strict;
    this.lexer = lexer;
    this.config = config;
  }
}
