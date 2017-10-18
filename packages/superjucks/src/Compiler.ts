import { ok } from 'assert';

import Config from './Config';
import Frame from './Frame';
import Node from './Node';
import { parse } from './Parser';

export async function compile(src: string, config: Config) {
  const c = new Compiler();
  const p = parse(src, config);
  await c.compile(p, new Frame());
  return c.buffer.join('');
}

export default class Compiler {
  public buffer: string[] = [];
  protected currentIndent: number = 0;

  public compileAggregate(node: Node, frame: Frame, start?: any, end?: any) {
    if (start) {
      this.emit(start);
    }
    for (let i = 0; i < node.children.length; i++) {
      if (i > 0) {
        this.emit(', ', false);
      }
      node.children[i].compile(this, frame);
    }
    if (end) {
      this.emit(end);
    }
  }

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

  public indent(callback: () => void, indent = 1) {
    this.currentIndent += indent;
    callback();
    this.currentIndent -= indent;
  }

  public emitInlineComment(str: string) {
    this.emitLine(`// ${str}`);
  }

  public emit(code: string, whitespace = true) {
    const w = whitespace ? '  '.repeat(this.currentIndent) : '';
    this.buffer.push(w + code);
  }

  public emitLine(code: string) {
    this.buffer.push(code + '\n');
  }

  public emitWrite(fn: () => void) {
    this.emit('this.buf.write(');
    fn();
    this.emit(');\n', false);
  }

  public emitEscape(fn: () => void) {
    this.emit('this.buf.esc(');
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
