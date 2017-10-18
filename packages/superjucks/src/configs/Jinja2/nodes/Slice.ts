import Compiler from '../../../Compiler';
import Frame from '../../../Frame';
import { Token } from '../../../Lexer';
import Node from '../../../Node';
import * as Nodes from '../../../nodes/index';
import Parser from '../../../Parser';

interface ISliceArgs {
  start: Node | null;
  stop: Node | null;
  step: Node | null;
}

export default class Slice extends Node {
  public compile() {
    return;
  }
  public constructor(line: number, col: number, args: ISliceArgs) {
    super(line, col, {
      start: args.start || new Nodes.Literal(line, col, { value: null }),
      step: args.step || new Nodes.Literal(line, col, { value: 1 }),
      stop: args.stop || new Nodes.Literal(line, col, { value: null })
    });
  }
}
