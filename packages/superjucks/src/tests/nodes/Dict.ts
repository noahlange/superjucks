import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

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

test('should refuse to compile a shorthand object node with symbols not in scope', async t => {
  const ast = new Nodes.Dict(0, 0, {
    children: [
      new Nodes.Symbol(0, 0, { value: 'one' }),
      new Nodes.Symbol(0, 0, { value: 'foobar' })
    ]
  });
  await t.throws(
    compile(ast),
    'Cannot compile "one" into shorthand dictionary without corresponding frame variable.'
  );
});

test('should compile a longhand object node', async t => {
  const ast = new Nodes.Dict(0, 0, {
    children: [
      new Nodes.Pair(0, 0, {
        key: new Nodes.Symbol(0, 0, { value: 'foo' }),
        value: new Nodes.Literal(0, 0, { value: 42 })
      })
    ]
  });
  t.is(await compile(ast), '{ foo: 42 }');
});
