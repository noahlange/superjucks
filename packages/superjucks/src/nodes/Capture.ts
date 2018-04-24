import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';
import Parser from '../Parser';

export default class CaptureNode extends Node {
  public body: Node;

  /**
   * Compiles a Capture node into an IIFE for assigning
   * to variables, &c.
   * ```javascript
   * (() => {
   *   const buffer = new lib.Buffer;
   *   // whatever was going to happen in a new buffer
   *   return buffer.out();
   * })()
   * ```
   */
  public compile(compiler: Compiler, frame: Frame) {
    compiler.emit('(() => {\n', false);
    compiler.indent(() => {
      compiler.emitLine('const buffer = new lib.Buffer;');
      compiler.compile(this.body, frame);
      compiler.emitLine('return buffer.out();');
    });
    compiler.emitLine('})()');
  }
}
