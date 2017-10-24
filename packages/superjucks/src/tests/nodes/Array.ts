import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import run from '../helpers/run';

test('should compile an array node', async t => {
  const ast = new Nodes.Array(0, 0, {
    children: [
      new Nodes.Literal(0, 0, { value: 1 }),
      new Nodes.Literal(0, 0, { value: 'foobar' })
    ]
  });
  t.is(await compile(ast), '[ 1, \'foobar\' ]');
});
