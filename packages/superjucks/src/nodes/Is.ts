import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';
import * as Nodes from './index';

export default class IsNode extends Node {
  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    const is = parser.skipValue(Token.SYMBOL, 'is');
    if (is) {
      const not = parser.skipValue(Token.SYMBOL, 'not');
      node = new IsNode(node.line, node.col, { left: node, right: next() });
      if (not) {
        node = new Nodes.Not(node.line, node.col, { body: node });
      }
    }
    return node;
  }

  public compile(compiler: Compiler, frame: Frame) {
    const name = this.name;
    let right = this.right.value;
    if (this.right instanceof Nodes.FunctionCall) {
      right = this.right.name.value;
    }
    compiler.emit(`(await env.getTest('${ right }').call(ctx, `, false);
    compiler.compile(this.left, frame);
    if (this.right.args) {
      for (const child of this.right.args.children) {
        compiler.emit(', ', false);
        child.compile(compiler, frame);
      }
    }
    compiler.emit(')) === true', false);
  }
}
