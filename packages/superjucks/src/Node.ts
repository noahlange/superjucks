import Compiler from './Compiler';
import Frame from './Frame';

abstract class Node {
  [key: string]: any;

  public static traverseAndCheck(
    obj: Node,
    t: typeof Node,
    res: any[] = []
  ): void {
    if (obj instanceof t) {
      res.push(obj);
    }
    if (obj instanceof Node) {
      obj.findAll(t, res);
    }
  }

  public fields: any[] = [];
  public line: number;
  public col: number;
  public name: any;

  public abstract compile(compiler: Compiler, frame: Frame): void;

  public *[Symbol.iterator]() {
    for (const field of this.fields) {
      yield [field, this[field]];
    }
  }

  public findAll(t: typeof Node, results?: any): Node[] {
    results = results || [];
    if (this.children && this.children.length) {
      for (const child of this.children) {
        Node.traverseAndCheck(child, t, results);
      }
    } else {
      for (const field of this.fields) {
        Node.traverseAndCheck(this[field], t, results);
      }
    }
    return results;
  }

  constructor(line: number = 0, col: number = 0, args: any) {
    this.line = line;
    this.col = col;
    for (const key of Object.keys(args)) {
      this[key] = args[key];
      this.fields.push(key);
    }
  }
}

export default Node;
