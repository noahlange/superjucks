import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import run from '../helpers/run';

test('should compile a concat node', async t => {
  const toCompile = new Nodes.Concat(0, 0, {
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 2 })
  });
  t.is(await compile(toCompile), '`${1}` + `${2}`');
});

test('should concatenate correctly', async t => {
  t.is(await run('{{ 1 ~ 2 }}'), '12');
});
