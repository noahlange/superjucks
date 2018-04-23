import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Aggregate from './Aggregate';
import * as Nodes from './index';

export default class DictNode extends Aggregate {
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('{ ', false);
    for (const child of this.children) {
      if (child instanceof Nodes.Symbol) {
        // if we're using symbols as shorthand keys, make sure they're in frame.
        if (frame.get(child.value) === null) {
          throw new Error(
            `Cannot compile "${child.value}" into shorthand dictionary item without corresponding frame variable.`
          );
        }
      }
      frame.set(child.value, true);
      compiler.compile(child, frame);
      if (this.children.indexOf(child) < this.children.length - 1) {
        compiler.emit(', ', false);
      }
    }
    compiler.emit(' }', false);
  }
}
