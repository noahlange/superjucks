import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Literal from './Literal';

export default class OutputNode extends Node {
  public children: Node[];
  public compile() {
    return;
  }
}
