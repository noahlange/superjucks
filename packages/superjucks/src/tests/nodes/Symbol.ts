import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile an in-frame symbol node', async t => {
  const frame = new Frame();
  frame.set('one', '2');
  const ast = new Nodes.Symbol(0, 0, { value: 'one' });
  t.is(await compile(ast, frame), 'one');
});

test('should compile an out-of-frame symbol node', async t => {
  const ast = new Nodes.Symbol(0, 0, { value: 'two' });
  t.is(await compile(ast), 'lib.lookup(\'two\')');
});
