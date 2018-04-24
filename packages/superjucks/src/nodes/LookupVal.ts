import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class LookupValueNode extends Node {
  public target: Node;
  public value: Node;
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('lib.get(', false);
    compiler.compile(this.target, frame);
    compiler.emit(', ', false);
    compiler.compile(this.value, frame);
    compiler.emit(')', false);
  }
}
