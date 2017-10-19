import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import * as Nodes from './index';

export default class FunctionCallNode extends Node {
  public name: Nodes.Symbol;
  public args: Nodes.List;
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('await ', false);
    compiler.compile(this.name, frame);
    compiler.compile(this.args, frame);
  }
}
