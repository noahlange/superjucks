import { ok } from 'assert';

import Config from './Config';
import Frame from './Frame';
import Node from './Node';
import { parse } from './Parser';

export default class Compiler {

  public static async compile(src: string, config: Config) {
    const c = new Compiler();
    const p = parse(src, config);
    await c.compile(p, new Frame());
    return c.buffer.join('');
  }

  public buffer: string[] = [];
  public template: string;
  public currentIndent: number = 0;

  public getValueOf(val: string | Node): string | Node {
    while (typeof val !== 'string') {
      if (val && (val.value || val.name)) {
        val = val.value || val.name;
      } else {
        break;
      }
    }
    return val;
  }

  /*
   * https://gist.github.com/gordonbrander/2230317
   * As an alternative to something like shortid...
   */
  public id() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  public indent(callback: () => void, indent = 1) {
    this.currentIndent += indent;
    callback();
    this.currentIndent -= indent;
  }

  public emitComment(str: string) {
    this.emitLine(`// ${str}`);
  }

  public emit(code: string, whitespace = true) {
    const w = whitespace ? '  '.repeat(this.currentIndent) : '';
    this.buffer.push(w + code);
  }

  public emitLine(code: string) {
    const w = '  '.repeat(this.currentIndent);
    this.buffer.push(w + code + '\n');
  }

  public emitWrite(fn: () => void) {
    this.emit('buffer.write(');
    fn();
    this.emit(');\n', false);
  }

  public emitEscape(fn: () => void) {
    this.emit('buffer.esc(');
    fn();
    this.emit(');\n', false);
  }

  public async compile(node: Node, frame: Frame) {
    if (!node.compile) {
      throw new Error(
        `Cannot compile node ${node.constructor
          .name}. Ensure instance method "compile" is implemented.`
      );
    } else if (typeof node.compile === 'function') {
      await node.compile(this, frame);
    } else {
      throw new Error(
        `Failed to compile node ${node.constructor
          .name}. Check method "compile" implementation.`
      );
    }
  }
}
