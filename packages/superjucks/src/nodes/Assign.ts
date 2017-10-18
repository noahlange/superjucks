import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Parser from '../Parser';

export default class AssignNode extends Node {
  public target: Node;
  public value: Node;
  public compile() {
    return;
  }
}
