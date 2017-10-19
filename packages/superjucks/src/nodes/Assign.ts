import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Parser from '../Parser';

export default class AssignNode extends Node {
  public target: Node;
  public value: Node;
  public compile(compiler: Compiler, frame: Frame) {
    compiler.compile(this.target, frame);
    compiler.emit(' = ', false);
    compiler.compile(this.value, frame);
  }
}
