import Node from '../../Node';
import { parse } from '../../Parser';

export function transform(tree: any) {
  function _transform(node: Node) {
    const ctor = node.constructor;
    const children: Node[] = [];
    for (const [key, value] of node) {
      const isScalar = !(value instanceof Node);
      const child = Array.isArray(value)
        ? value.map(_transform)
        : [isScalar ? value : _transform(value)];
      children.push.apply(
        children,
        child.map(f => (f === undefined ? null : f))
      );
    }
    return [ctor, ...children];
  }
  return _transform(tree);
}

export function ast(s: string, config?: any): any {
  return transform(parse(s, config));
}
