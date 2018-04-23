import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile pair node', async t => {
  const key = new Nodes.Literal(0, 0, { value: 'bar' });
  const value = new Nodes.Literal(0, 0, { value: 42 });
  const ast = new Nodes.Pair(0, 0, { key, value });
  t.is(await compile(ast), '\'bar\': 42');
});
