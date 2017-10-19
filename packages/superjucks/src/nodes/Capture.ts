import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Parser from '../Parser';

export default class CaptureNode extends Node {
  public body: any;
  public target: any;
  public compile(compiler: Compiler, frame: Frame) {
    return;
  }
}
