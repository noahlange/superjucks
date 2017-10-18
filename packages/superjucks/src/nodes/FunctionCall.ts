import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class FunctionCallNode extends Node {
  public name: any;
  public args: any;
  public compile() {
    return;
  }
}
