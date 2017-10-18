import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class PairNode extends Node {
  public key: Node;
  public value: Node;
  public compile() {
    return;
  }
}
