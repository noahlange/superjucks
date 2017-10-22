import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import { joinKeywords } from '../utils';

export default class IfNode extends Node {

  public static parse(parser: Parser) {
    const tags = {
      else: parser.config.syntax.tags.ELSE,
      elseif: parser.config.syntax.tags.ELSEIF,
      endif: joinKeywords(
        parser.config.syntax.keywords.END,
        parser.config.syntax.tags.IF
      ),
      if: parser.config.syntax.tags.IF
    };

    const tag = parser.peekToken();
    let node;

    if (
      parser.skipValue(Token.SYMBOL, tags.if) ||
      parser.skipValue(Token.SYMBOL, tags.elseif)
    ) {
      node = new IfNode(tag.line, tag.col, {
        body: null,
        cond: null,
        else: null
      });
    } else {
      throw new Error(
        `parseIf: expected ${tags.if}, ${tags.elseif} (${tag.line}, ${tag.col})`
      );
    }

    node.cond = parser.parseExpression();
    parser.advanceAfterBlockEnd(tag.value);

    node.body = parser.parseUntilBlocks(tags.elseif, tags.else, tags.endif);
    const tok = parser.peekToken();

    if (parser.matches(tok.value, tags.elseif)) {
      node.else = this.parse(parser);
    } else if (parser.matches(tok.value, tags.else)) {
      const elseTok = parser.nextToken();
      const ifTok = parser.peekToken();
      if (parser.matches(ifTok.value, tags.if)) {
        node.else = this.parse(parser);
      } else {
        parser.advanceAfterBlockEnd('else');
        node.else = parser.parseUntilBlocks('endif');
        parser.advanceAfterBlockEnd();
      }
    } else if (parser.matches(tok.value, tags.endif)) {
      node.else = undefined;
      parser.advanceAfterBlockEnd();
    } else {
      throw new Error(
        `parseIf: expected if, elif, else if or else if, got end of file (${tag.line}, ${tag.col})`
      );
    }

    return node;
  }

  public fields = ['cond', 'body', 'else'];

  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('if (');
    compiler.compile(this.cond, frame);
    compiler.emit(') {\n', false);
    compiler.indent(() => this.body.compile(compiler, frame));
    if (this.else) {
      compiler.emitLine(`} else {`);
      compiler.indent(() => this.else.compile(compiler, frame));
    }
    compiler.emitLine('}');
  }
}
