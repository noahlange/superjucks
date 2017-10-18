import { ok } from 'assert';

import Compiler from '../Compiler';
import Frame from '../Frame';
import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import ListNode from './List';
import SymbolNode from './Symbol';

export default class FilterNode extends Node {
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

      name = new SymbolNode(tok.line, tok.col, { value: name });
      const args = new ListNode(name.line, name.col, { children: [node] });
      node = new FilterNode(name.line, name.col, { name, args });

      if (parser.peekToken().type === Token.LEFT_PAREN) {
        const call = parser.parsePostfix(node);
        node.args.children.push(...call.args.children);
      }
    }

    return node;
  }
  public name: SymbolNode;
  public args: ListNode;
  public compile() {
    return;
  }
}
