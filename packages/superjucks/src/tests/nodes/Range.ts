import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile an inclusive range node', async t => {
  const ast = new Nodes.Range(0, 0, {
    left: new Nodes.Literal(0, 0, { value: -5 }),
    right: new Nodes.Symbol(0, 0, { value: 'foobar' })
  });
  t.is(await compile(ast), 'lib.range(-5, foobar, 1, false)');
});

test('should compile an exclusive range node', async t => {
  const ast = new Nodes.Range(0, 0, {
    exclusive: true,
    left: new Nodes.Literal(0, 0, { value: 1 }),
    right: new Nodes.Literal(0, 0, { value: 3 }),
  });
  t.is(await compile(ast), 'lib.range(1, 3, 1, true)');
});
