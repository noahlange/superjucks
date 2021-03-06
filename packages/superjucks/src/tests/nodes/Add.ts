import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import run from '../helpers/run';

test('should compile an add node', async t => {
  const toCompile = new Nodes.Add(0, 0, {
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 2 })
  });
  t.is(await compile(toCompile), '1 + 2');
});

test('should compile correctly', async t => {
  t.is(await run('{{ 1 + 2 }}'), '3');
});
