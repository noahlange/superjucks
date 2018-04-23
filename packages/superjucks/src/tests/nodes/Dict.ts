import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';

test('should compile a shorthand object node', async t => {
  const frame = new Frame();
  frame.set('one', '1');
  frame.set('foobar', 'foobar');
  const ast = new Nodes.Dict(0, 0, {
    children: [
      new Nodes.Symbol(0, 0, { value: 'one' }),
      new Nodes.Symbol(0, 0, { value: 'foobar' })
    ]
  });
  t.is(await compile(ast, frame), '{ one, foobar }');
});

test('should throw when attempting to shorthand a key with a symbol not in scope', async t => {
  const ast = new Nodes.Dict(0, 0, {
    children: [
      new Nodes.Symbol(0, 0, { value: 'one' }),
      new Nodes.Symbol(0, 0, { value: 'foobar' })
    ]
  });
  await t.throws(compile(ast));
});

test('should compile a longhand object node', async t => {
  const ast = new Nodes.Dict(0, 0, {
    children: [
      new Nodes.Pair(0, 0, {
        key: new Nodes.Literal(0, 0, { value: 'foo' }),
        value: new Nodes.Literal(0, 0, { value: 42 })
      })
    ]
  });
  t.is(await compile(ast), '{ \'foo\': 42 }');
});
