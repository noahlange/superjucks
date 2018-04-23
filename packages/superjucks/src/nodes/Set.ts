import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import AggregateNode from './Aggregate';
import ArrayNode from './Array';
import CaptureNode from './Capture';
import PairNode from './Pair';
import SymbolNode from './Symbol';

export default class SetNode extends Node {

  public static parse(parser: Parser) {
    const tagStart = parser.config.syntax.tags.SET;
    const tagEnd = parser.config.syntax.keywords.END;
    const tag = parser.peekToken();
    parser.skipValue(Token.SYMBOL, tagStart);

    const target = parser.parsePrimary();
    if (parser.skip(Token.COMMA)) {
      throw new Error('No commas! Use object or array destructuring instead.');
    }

    const node = new SetNode(tag.line, tag.col, { target, value: null });

    if (parser.skipValue(Token.OPERATOR, '=')) {
      node.value = parser.parseExpression();
      parser.advanceAfterBlockEnd(tag.value);
    } else if (parser.skip(Token.BLOCK_END)) {
      node.fields.push('body');
      node.value = null;
      node.body = new CaptureNode(tag.line, tag.col, {
        body: parser.parseUntilBlocks(tagEnd + tagStart)
      });
      parser.advanceAfterBlockEnd();
    }
    return node;
  }

  public compile(compiler: Compiler, frame: Frame) {
    const f = new Frame(frame);
    const id = compiler.id();
    const symbols = this.findAll(SymbolNode);
    for (const sym of symbols) {
      f.set(sym.value, true);
    }
    compiler.emitLine('{');
    compiler.indent(() => {
      compiler.emit('let ');
      compiler.compile(this.target, f);
      compiler.emit(' = ', false);
      compiler.compile(this.value, f);
      compiler.emit(';', false);
      compiler.emitLine('');
      for (const sym of symbols) {
        compiler.emitLine(`lib.frame.set('${ sym.value }', ${ sym.value });`);
      }
    });
    compiler.emitLine('}');
  }
}
