import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Parser from '../Parser';

export default class CaseNode extends Node {
  public cond: Node;
  public body: Node;

  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
