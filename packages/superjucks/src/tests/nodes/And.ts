import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import run from '../helpers/run';

test('should compile an and node', async t => {
  const ast = new Nodes.And(0, 0, {
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 'foobar' })
  });
  t.is(await compile(ast), '1 && \'foobar\'');
});

test('should compile into runnable code', async t => {
  t.is(await run('{{ false and true }}'), 'false');
  t.is(await run('{{ 1 and 2 }}'), '2');
});
