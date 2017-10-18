import test, { TestContext } from 'ava';
import Node from '../Node';
import * as Nodes from '../nodes/index';
import { parse } from '../Parser';

test('AST should search self for nodes by type', t => {
  const ast = parse(`{% set { foo } = bar %}`);
  const symbols = ast.findAll(Nodes.Symbol);
  t.deepEqual(symbols.map(s => s.value), [ 'foo', 'bar' ]);
});
