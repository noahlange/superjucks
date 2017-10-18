import { Token } from '../Lexer';
import Node from '../Node';
import Parser from '../Parser';

import ArrayNode from './Array';
import CaptureNode from './Capture';

export default class SetNode extends Node {

  public static parse(parser: Parser) {
    const tagStart = parser.config.syntax.tags.SET;
    const tagEnd = parser.config.syntax.keywords.END;
    const tag = parser.peekToken();
    parser.skipValue(Token.SYMBOL, tagStart);

    const targets = new ArrayNode(tag.line, tag.col, { children: [] });
    const node = new SetNode(tag.line, tag.col, { targets, value: null });

    let target = parser.parsePrimary();
    while (target) {
      node.targets.children.push(target);
      if (!parser.skip(Token.COMMA)) {
        break;
      }
      target = parser.parsePrimary();
    }

    if (parser.skipValue(Token.OPERATOR, '=')) {
      node.value = parser.parseExpression();
      parser.advanceAfterBlockEnd(tag.value);
    } else if (parser.skip(Token.BLOCK_END)) {
      node.fields.push('body');
      node.value = null;
      node.body = new CaptureNode(tag.line, tag.col, { body: parser.parseUntilBlocks(tagEnd + tagStart) });
      parser.advanceAfterBlockEnd();
    }
    return node;
  }

  public compile() {
    return;
  }
}
