import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Aggregate from './Aggregate';

export default class ListNode extends Aggregate {
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('(', false);
    super.compile(compiler, frame);
    compiler.emit(')', false);
  }
}
