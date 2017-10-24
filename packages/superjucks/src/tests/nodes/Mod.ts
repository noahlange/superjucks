import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import run from '../helpers/run';

test('should compile a modulo node', async t => {
  const ast = new Nodes.Mod(0, 0, {
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 2 })
  });
  t.is(await compile(ast), '1 % 2');
});

test('should evaluate a modulo node', async t => {
  t.is(await run('{{ 2 % 2 }}'), '0');
});
