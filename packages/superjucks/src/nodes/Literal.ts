import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

export default class LiteralNode extends Node {
  public value: Node | string;
  public compile(compiler: Compiler, frame: Frame) {
    if (typeof this.value === 'string') {
      let val = this.value.replace(/\\/g, '\\\\');
      val = val.replace(/\'/g, `\\'`);
      val = val.replace(/\n/g, '\\n');
      val = val.replace(/\r/g, '\\r');
      val = val.replace(/\t/g, '\\t');
      compiler.emit(`'${val}'`, false);
    } else if (this.value === null) {
      compiler.emit('null', false);
    } else if (this.value === undefined) {
      compiler.emit('', false);
    } else {
      compiler.emit(this.value.toString(), false);
    }
  }
}
