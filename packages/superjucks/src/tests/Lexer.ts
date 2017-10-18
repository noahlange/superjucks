import test, { TestContext } from 'ava';
import { lex, Token } from '../Lexer';
import { parse } from '../Parser';

test('should properly handle block trimming', t => {
  const one = '\r{%-foo()-%}\r';
  const two = '\t{%-foo()-%}\t';
  const three = '\r\n{%-foo()-%}\r\nd';
  const four = '\nd{%-foo()-%}\nd';
  const lexers = [
    lex(one, { trimBlocks: true, lstripBlocks: true }),
    lex(two, { trimBlocks: true, lstripBlocks: true }),
    lex(three, { trimBlocks: true, lstripBlocks: true }),
    lex(four, { trimBlocks: true, lstripBlocks: true })
  ];

  for (const lexer of lexers) {
    let tok;
    const tokens = [];
    // tslint:disable-next-line no-conditional-assignment
    while ((tok = lexer.nextToken())) {
      tokens.push(tok.type);
    }
    t.deepEqual(tokens, [
      Token.DATA,
      Token.BLOCK_START,
      Token.SYMBOL,
      Token.LEFT_PAREN,
      Token.RIGHT_PAREN,
      Token.BLOCK_END,
      Token.DATA
    ]);
  }
});

test('should properly handle whitespace escapes', t => {
  const one = `{%-foo()"\\r"-%}`;
  const two = `{%-foo()"\\t"-%}`;
  const three = `{%-foo()'\\n'-%}`;
  const lexers = [
    lex(one, { trimBlocks: true }),
    lex(two, { trimBlocks: true }),
    lex(three, { trimBlocks: true })
  ];

  for (const lexer of lexers) {
    let tok;
    const tokens = [];
    // tslint:disable-next-line no-conditional-assignment
    while ((tok = lexer.nextToken())) {
      tokens.push(tok.type);
    }
    t.deepEqual(tokens, [
      Token.BLOCK_START,
      Token.SYMBOL,
      Token.LEFT_PAREN,
      Token.RIGHT_PAREN,
      Token.STRING,
      Token.BLOCK_END
    ]);
  }
});
