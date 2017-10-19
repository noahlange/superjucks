import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Parser from '../Parser';

export default class SymbolNode extends Node {
  public value: any;
  public compile(compiler: Compiler, frame: Frame) {
    const name = (compiler.getValueOf(this.value) || '') as string;
    const v = frame.lookup(name) ? name : null;
    const str = v ? v : `lookup('${ name }')`;
    compiler.emit(str, false);
  }
}
