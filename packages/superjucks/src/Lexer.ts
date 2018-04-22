const WHITESPACE_CHARS = ' \n\t\r\u00A0';
const DELIM_CHARS = '()[]{}%*-+~/#,:|.<>=!?';
const INT_CHARS = '0123456789';
const REGEX_FLAGS = ['g', 'i', 'm', 'y'];

const BLOCK_START = '{%';
const BLOCK_END = '%}';
const VARIABLE_START = '{{';
const VARIABLE_END = '}}';
const COMMENT_START = '{#';
const COMMENT_END = '#}';

export enum Token {
  STRING,
  WHITESPACE,
  DATA,
  BLOCK_START,
  BLOCK_END,
  VARIABLE_START,
  VARIABLE_END,
  COMMENT,
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACKET,
  RIGHT_BRACKET,
  LEFT_CURLY,
  RIGHT_CURLY,
  OPERATOR,
  COMMA,
  COLON,
  TILDE,
  PIPE,
  INT,
  FLOAT,
  BOOLEAN,
  NULL,
  SYMBOL,
  SPECIAL,
  REGEX
}

interface ITokenizerTagsOpts {
  BLOCK_START?: string;
  BLOCK_END?: string;
  VARIABLE_START?: string;
  VARIABLE_END?: string;
  COMMENT_START?: string;
  COMMENT_END?: string;
}

interface ITokenizerTags {
  BLOCK_START: string;
  BLOCK_END: string;
  VARIABLE_START: string;
  VARIABLE_END: string;
  COMMENT_START: string;
  COMMENT_END: string;
}

interface ITokenizerOpts {
  nullTokens?: string[];
  lstripBlocks?: boolean;
  trimBlocks?: boolean;
  tags?: ITokenizerTagsOpts;
}

export interface IToken {
  type: Token;
  value: any;
  line: number;
  col: number;
}

export default class Lexer {
  public str: string;
  public tags: ITokenizerTags;
  public index: number = 0;

  public line: number = 1;
  public col: number = 1;
  public tline: number = 0;
  public tcol: number = 0;

  private inCode: boolean = false;
  private len: number;
  private trimBlocks: boolean;
  private nullTokens: string[];
  private lstripBlocks: boolean;

  public back(): void {
    this.index--;
    if (this.current() === '\n') {
      this.line--;
      const idx = this.str.lastIndexOf('\n', this.index - 1);
      this.col = this.index - (idx === -1 ? 0 : idx);
    } else {
      this.col--;
    }
  }

  public forward() {
    this.index++;
    if (this.previous() === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
  }

  public forwardN(n: number): void {
    for (let i = 0; i < n; i++) {
      this.forward();
    }
  }

  public previous() {
    return this.str.charAt(this.index - 1);
  }

  public current() {
    return !this.isFinished() ? this.str.charAt(this.index) : '';
  }

  /**
   * Determine whether the current token is a RegExp. Should be overridden in
   * the Nunjucks lexer to preserve expected behavior for r-prefixed RegExps.
   */
  public testRegExp(): boolean {
    let regexIdx = this.index - 1;
    let isRegExp = false;
    let whitespace = true;
    // go backwards until we hit a non-whitespace token
    while (whitespace && regexIdx > 0) {
      const previous = this.str.charAt(regexIdx);
      if (/\s/.test(previous)) {
        regexIdx -= 1;
      } else {
        whitespace = false;
        // the following characters are acceptable previous tokens for a RegExp
        // but not for a division operator, which is the same operator ('/')
        if ('(,=:[!&|?{};'.includes(previous)) {
          isRegExp = true;
        }
      }
    }
    return isRegExp;
  }

  /**
   * Parse a RegExp token.
   */
  public parseRegExp(): IToken {
    const col = this.tcol;
    const line = this.tline;
    this.forward();
    let regexBody = '';
    while (!this.isFinished()) {
      if (this.current() === '/' && this.previous() !== '\\') {
        this.forward();
        break;
      } else {
        regexBody = regexBody + this.current();
        this.forward();
      }
    }
    // Check for flags.
    // The possible flags are according to
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
    let flags = '';
    while (!this.isFinished()) {
      const isCurrentAFlag = REGEX_FLAGS.indexOf(this.current()) !== -1;
      if (isCurrentAFlag) {
        flags = flags + this.current();
        this.forward();
      } else {
        break;
      }
    }
    return {
      col,
      line,
      type: Token.REGEX,
      value: { body: regexBody, flags }
    };
  }

  public parseDelimeter() {
    let curr = this.str[this.index];
    const line = this.tline;
    const col = this.tcol;
    // We've hit a delimiter (a special char like a bracket)
    this.forward();
    const complexOps = [
      '==',
      '===',
      '!=',
      '!==',
      '<=',
      '>=',
      '//',
      '**',
      '??',
      '?:',
      '..',
      '...'
    ];
    const curComplex = curr + this.current();
    let type;
    if (complexOps.indexOf(curComplex) !== -1) {
      this.forward();
      curr = curComplex;
      // See if this is a strict equality / inequality comparator
      if (complexOps.indexOf(curComplex + this.current()) !== -1) {
        curr = curComplex + this.current();
        this.forward();
      }
    }
    switch (curr) {
      case '(':
        type = Token.LEFT_PAREN;
        break;
      case ')':
        type = Token.RIGHT_PAREN;
        break;
      case '[':
        type = Token.LEFT_BRACKET;
        break;
      case ']':
        type = Token.RIGHT_BRACKET;
        break;
      case '{':
        type = Token.LEFT_CURLY;
        break;
      case '}':
        type = Token.RIGHT_CURLY;
        break;
      case ',':
        type = Token.COMMA;
        break;
      case ':':
        type = Token.COLON;
        break;
      case '~':
        type = Token.TILDE;
        break;
      case '|':
        type = Token.PIPE;
        break;
      default:
        type = Token.OPERATOR;
        break;
    }
    return { type, value: curr, line, col };
  }

  public parseLiteral(tok: string) {
    const line = this.tline;
    const col = this.tcol;
    // We are not at whitespace or a delimiter, so extract the text and parse it
    if (tok.match(/^[-+]?[0-9]+$/)) {
      if (this.current() === '.') {
        this.forward();
        if (this.current() === '.') {
          this.back();
          return { type: Token.INT, value: tok, line, col };
        } else {
          const dec = this._extract(INT_CHARS);
          return {
            col,
            line,
            type: Token.FLOAT,
            value: `${tok}.${dec}`
          };
        }
      } else {
        return { type: Token.INT, value: tok, line, col };
      }
    } else if (tok.match(/^(true|false)$/)) {
      return { type: Token.BOOLEAN, value: tok, line, col };
    } else if (this.nullTokens.indexOf(tok) > -1) {
      return { type: Token.NULL, value: tok, line, col };
    } else if (tok) {
      return { type: Token.SYMBOL, value: tok, line, col };
    } else {
      throw new Error('Unexpected value while lexing: ' + tok);
    }
  }

  public parseString(delimiter: string): string {
    this.forward();
    let str = '';
    while (!this.isFinished() && this.current() !== delimiter) {
      const curr = this.current();
      if (curr === '\\') {
        this.forward();
        switch (this.current()) {
          case 'n':
            str = str + '\n';
            break;
          case 't':
            str = str + '\t';
            break;
          case 'r':
            str = str + '\r';
            break;
          default:
            str = str + this.current();
            break;
        }
        this.forward();
      } else {
        str = str + curr;
        this.forward();
      }
    }
    this.forward();
    return str;
  }

  public isFinished(): boolean {
    return this.index >= this.len;
  }

  public nextToken(): IToken | null {
    const line = this.line;
    const col = this.col;
    // we need to store the current token's line and col so we can report the
    // correct line/col, even if we continue to shuffle around.
    this.tline = line;
    this.tcol = col;
    let tok;
    if (this.inCode) {
      let curr = this.current();
      if (this.isFinished()) {
        return null;
      } else if (curr === '"' || curr === "'") {
        return { type: Token.STRING, value: this.parseString(curr), line, col };
      } else {
        tok = this._extract(WHITESPACE_CHARS);
        if (tok) {
          return { type: Token.WHITESPACE, value: tok, line, col };
        } else if (
          this._matches(this.tags.BLOCK_END) ||
          this._matches('-' + this.tags.BLOCK_END)
        ) {
          tok =
            this._extractString(this.tags.BLOCK_END) ||
            this._extractString('-' + this.tags.BLOCK_END);
          this.inCode = false;
          if (this.trimBlocks) {
            curr = this.current();
            if (curr === '\n') {
              this.forward();
            } else if (curr === '\r') {
              this.forward();
              curr = this.current();
              if (curr === '\n') {
                this.forward();
              } else {
                this.back();
              }
            }
          }
          return { type: Token.BLOCK_END, value: tok, line, col };
        } else if (
          this._matches(this.tags.VARIABLE_END) ||
          this._matches('-' + this.tags.VARIABLE_END)
        ) {
          tok =
            this._extractString(this.tags.VARIABLE_END) ||
            this._extractString('-' + this.tags.VARIABLE_END);
          this.inCode = false;
          return { type: Token.VARIABLE_END, value: tok, line, col };
        } else {
          // this might be the start of a regex.
          if (curr === '/') {
            if (this.testRegExp()) {
              return this.parseRegExp();
            }
          }
          if (DELIM_CHARS.indexOf(curr) !== -1) {
            return this.parseDelimeter();
          } else {
            tok = this._extractUntil(WHITESPACE_CHARS + DELIM_CHARS);
            if (tok) {
              return this.parseLiteral(tok);
            }
          }
        }
      }
    } else {
      // Parse out the template text, breaking on tag
      // delimiters because we need to look for block/variable start
      // tags (don't use the full delimChars for optimization)
      const startChars =
        this.tags.BLOCK_START.charAt(0) +
        this.tags.VARIABLE_START.charAt(0) +
        this.tags.COMMENT_START.charAt(0) +
        this.tags.COMMENT_END.charAt(0);
      if (this.isFinished()) {
        return null;
      } else if (
        this._matches(this.tags.BLOCK_START + '-') ||
        this._matches(this.tags.BLOCK_START)
      ) {
        tok =
          this._extractString(this.tags.BLOCK_START + '-') ||
          this._extractString(this.tags.BLOCK_START);
        this.inCode = true;
        return { type: Token.BLOCK_START, value: tok, line, col };
      } else if (
        this._matches(this.tags.VARIABLE_START + '-') ||
        this._matches(this.tags.VARIABLE_START)
      ) {
        tok =
          this._extractString(this.tags.VARIABLE_START + '-') ||
          this._extractString(this.tags.VARIABLE_START);
        this.inCode = true;
        return { type: Token.VARIABLE_START, value: tok, line, col };
      } else {
        tok = '';
        let data: string | null;
        let lastLine: string;
        let inComment = false;
        let tokenType: Token;

        if (this._matches(this.tags.COMMENT_START)) {
          inComment = true;
          tok = this._extractString(this.tags.COMMENT_START);
        }

        // Continually consume text, breaking on the tag delimiter characters and checking to see if it's a start tag.
        // We could hit the end of the template in the middle of our looping, so check for the null return value from
        // _extractUntil
        data = this._extractUntil(startChars);
        while (data !== null) {
          tok = tok + data;
          if (
            (this._matches(this.tags.BLOCK_START) ||
              this._matches(this.tags.VARIABLE_START) ||
              this._matches(this.tags.COMMENT_START)) &&
            !inComment
          ) {
            if (
              this.lstripBlocks &&
              this._matches(this.tags.BLOCK_START) &&
              this.col > 0 &&
              this.col <= tok.length
            ) {
              lastLine = tok.slice(-this.col);
              if (/^\s+$/.test(lastLine)) {
                // Remove block leading whitespace from beginning of the string
                tok = tok.slice(0, -this.col);
                if (!tok.length) {
                  // All data removed, collapse to avoid unnecessary nodes
                  // by returning next token (block start)
                  return this.nextToken();
                }
              }
            }
            // If it is a start tag, stop looping
            break;
          } else if (this._matches(this.tags.COMMENT_END)) {
            if (!inComment) {
              throw new Error('unexpected end of comment');
            }
            tok = tok + this._extractString(this.tags.COMMENT_END);
            break;
          } else {
            // It does not match any tag, so add the character and
            // carry on
            tok = tok + this.current();
            this.forward();
          }
          data = this._extractUntil(startChars);
        }
        if (data === null && inComment) {
          throw new Error('expected end of comment, got end of file');
        }
        tokenType = inComment ? Token.COMMENT : Token.DATA;
        return { type: tokenType, value: tok, line, col };
      }
    }
    return null;
  }

  protected _extractMatching(
    breakOnMatch: boolean,
    charString: string
  ): string | null {
    // Pull out characters until a breaking char is hit.
    // If breakOnMatch is false, a non-matching char stops it.
    // If breakOnMatch is true, a matching char stops it.
    if (this.isFinished()) {
      return null;
    }
    const first = charString.indexOf(this.current());
    // Only proceed if the first character doesn't meet our condition
    if ((breakOnMatch && first === -1) || (!breakOnMatch && first !== -1)) {
      let match = this.current();
      this.forward();
      // And pull out all the chars one at a time until we hit a breaking char
      let idx = charString.indexOf(this.current());
      while (
        ((breakOnMatch === true && idx === -1) ||
          (breakOnMatch === false && idx !== -1)) &&
        !this.isFinished()
      ) {
        match = match + this.current();
        this.forward();
        idx = charString.indexOf(this.current());
      }
      return match;
    }
    return '';
  }

  protected _matches(str: string) {
    if (this.index + str.length > this.len) {
      return null;
    } else {
      return str === this.str.slice(this.index, this.index + str.length);
    }
  }

  private _extractString(str: string): string | null {
    if (this._matches(str)) {
      this.index += str.length;
      return str;
    }
    return null;
  }

  private _extractUntil(charString = ''): string | null {
    // Extract all non-matching chars, with the default matching set to everything
    return this._extractMatching(true, charString);
  }

  private _extract(charString: string) {
    return this._extractMatching(false, charString);
  }

  constructor(str: string, opts: ITokenizerOpts = {}) {
    this.str = str;
    this.len = str.length;
    this.nullTokens = opts.nullTokens || ['null'];
    this.trimBlocks = !!opts.trimBlocks;
    this.lstripBlocks = !!opts.lstripBlocks;
    this.tags = Object.assign(
      {
        BLOCK_END,
        BLOCK_START,
        COMMENT_END,
        COMMENT_START,
        VARIABLE_END,
        VARIABLE_START
      },
      opts.tags
    );
  }
}

export function lex(src: string, opts: ITokenizerOpts = {}) {
  return new Lexer(src, opts);
}
