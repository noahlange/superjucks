import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Aggregate from './Aggregate';
import List from './List';

export default class ArrayNode extends Aggregate {

  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('[ ', false);
    for (const child of this.children) {
      compiler.compile(child, frame);
      if (this.children.indexOf(child) < this.children.length - 1) {
        compiler.emit(', ', false);
      }
    }
    compiler.emit(' ]', false);
  }
}
