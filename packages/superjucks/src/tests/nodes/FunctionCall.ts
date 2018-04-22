import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('function call node should return an async function call', async t => {
  const frame = new Frame();
  frame.set('bar', 'bar');
  frame.set('baz', 'baz');
  frame.set('foo', 'fn');
  const bar = new Nodes.Symbol(0, 0, { value: 'bar' });
  const baz = new Nodes.Symbol(0, 0, { value: 'baz' });
  const args = new Nodes.List(0, 0, { children: [bar, baz] });
  const name = new Nodes.Symbol(0, 0, { value: 'foo' });
  const ast = new Nodes.FunctionCall(0, 0, { name, args });
  t.is(await compile(ast, frame), 'await foo(bar, baz)');
});

test('function call should look batshit without variables in frame', async t => {
  const bar = new Nodes.Symbol(0, 0, { value: 'bar' });
  const baz = new Nodes.Symbol(0, 0, { value: 'baz' });
  const args = new Nodes.List(0, 0, { children: [bar, baz] });
  const name = new Nodes.Symbol(0, 0, { value: 'foo' });
  const ast = new Nodes.FunctionCall(0, 0, { name, args });
  t.is(await compile(ast), 'await lib.lookup(\'foo\')(lib.lookup(\'bar\'), lib.lookup(\'baz\'))');
});
