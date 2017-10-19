import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile an and node', async t => {
  const ast = new Nodes.And(0, 0, {
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 'foobar' })
  });
  t.is(await compile(ast), '1 && \'foobar\'');
});
