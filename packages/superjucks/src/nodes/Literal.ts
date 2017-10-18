import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class LiteralNode extends Node {
  public value: Node | string;
  public compile() {
    return;
  }
}
