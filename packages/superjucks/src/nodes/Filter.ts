import { ok } from 'assert';

import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import CaptureNode from './Capture';
import ListNode from './List';
import LiteralNode from './Literal';
import OutputNode from './Output';

export default class FilterNode extends Node {

  public static parseBlock(parser: Parser) {
    const tagStart = parser.config.syntax.tags.FILTER;
    const tagEnd = parser.config.syntax.keywords.END;
    const tag = parser.nextToken();
    const { value } = parser.nextToken();
    parser.advanceAfterBlockEnd(tagStart);

    const node = new OutputNode(tag.line, tag.col, {
      children: [
        new FilterNode(tag.line, tag.col, {
          args: new ListNode(tag.line, tag.col, { children:
            [
              new CaptureNode(tag.line, tag.col, {
                body: parser.parseUntilBlocks(tagEnd + tagStart)
              })
            ]
          }),
          name: new LiteralNode(tag.line, tag.col, { value })
        })
      ]
    });

    parser.advanceAfterBlockEnd();
    return node;
  }

  public static parse(parser: Parser, next: () => Node) {
    let node = next();
    while (parser.skip(Token.PIPE)) {
      const tok = parser.nextToken();
      let name = tok.value;

      if (parser.strict) {
        // assert that the filter is found in the sandbox
        ok(
          parser.config.hasFilter(name),
          `Unknown filter "${name}" at ${tok.line}, ${tok.col}.`
        );
      }

      name = new LiteralNode(tok.line, tok.col, { value: name });
      const args = new ListNode(name.line, name.col, { children: [node] });
      node = new FilterNode(name.line, name.col, { name, args });

      if (parser.peekToken().type === Token.LEFT_PAREN) {
        const call = parser.parsePostfix(node);
        node.args.children.push(...call.args.children);
      }
    }

    return node;
  }

  public name: LiteralNode;
  public args: ListNode;

  public compile(compiler: Compiler, frame: Frame) {
    const args = this.args.children;
    compiler.emit('await lib.filter(');
    compiler.compile(this.name, frame);
    compiler.emit(', ', false);
    // ListNodes, by default, emit parens, so we've copied the generation codee
    // here, sans parens.
    for (const child of args) {
      compiler.compile(child, frame);
      if (args.indexOf(child) < args.length - 1) {
        compiler.emit(', ', false);
      }
    }
    compiler.emit('  '.repeat(compiler.currentIndent) + ')');
  }
}
