import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import List from './List';

export default class AggregateNode extends Node {
  public children: Node[];

  public addChild(node: any) {
    this.children.push(node);
  }

  public compile(compiler: Compiler, frame: Frame): void {
    for (let i = 0; i < this.children.length; i++) {
      if (i > 0) {
        compiler.emit(', ', false);
      }
      this.children[i].compile(compiler, frame);
    }
  }

  public constructor(line: number, col: number, args: any = {}) {
    super(
      line,
      col,
      args.children ? args : Object.assign(args, { children: [] })
    );
  }
}
