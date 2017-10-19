import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import * as Nodes from './index';
import ListNode from './List';

export default class MacroNode extends Node {
  public static parse(parser: Parser) {
    const macroTok = parser.peekToken();
    if (!parser.skipValue(Token.SYMBOL, 'macro')) {
      throw new Error('Expected macro');
    }

    const name = parser.parsePrimary(true);
    const args = parser.parseSignature();
    const node = new MacroNode(macroTok.line, macroTok.col, { name, args, body: null });

    parser.advanceAfterBlockEnd(macroTok.value);
    node.body = parser.parseUntilBlocks('endmacro');
    parser.advanceAfterBlockEnd();
    return node;
  }

  public name: any;
  public args: ListNode;
  public body: any;

  public compile(compiler: Compiler, frame: Frame) {
    const childFrame = new Frame(frame);
    for (const arg of this.args.children) {
      if (arg instanceof Nodes.Assign) {
        const name = compiler.getValueOf(arg.target) as string;
        childFrame.set(name, name);
      } else {
        const name = compiler.getValueOf(arg) as string;
        childFrame.set(name, name);
      }
    }
    compiler.emit('async ', false);
    compiler.compile(this.args, childFrame);
    compiler.emit(' => {\n', false);
    compiler.indent(() => {
      compiler.emitLine('const buffer = new Buffer();');
      compiler.compile(this.body, childFrame);
      compiler.emitLine('return buffer.out();');
    });
    compiler.emit('}', false);
  }
}
