import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class PairNode extends Node {
  public key: Node;
  public value: Node;
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit(`${ this.key.value }: `, false);
    compiler.compile(this.value, frame);
  }
}
