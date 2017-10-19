import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile a "not" node', async t => {
  const ast = new Nodes.Not(0, 0, {
    body: new Nodes.Literal(0, 0, { value: 'foobar' })
  });
  t.is(await compile(ast), '!(\'foobar\')');
});
