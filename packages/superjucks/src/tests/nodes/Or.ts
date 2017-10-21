import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile an or node', async t => {
  const ast = new Nodes.Or(0, 0, {
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 'foobar' })
  });
  t.is(await compile(ast), '1 || \'foobar\'');
});
