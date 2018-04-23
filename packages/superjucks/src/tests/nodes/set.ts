import test from 'ava';
import * as Nodes from '../../nodes/index';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

test('should throw for python-style destructuring', async t => {
  await t.throws(() => p('{% set foo, bar = baz %}'));
});

test('should parse set blocks', t => {
  t.deepEqual(p(`{% set foo = bar %}`), [
    Nodes.Root,
    [Nodes.Set, [Nodes.Symbol, 'foo'], [Nodes.Symbol, 'bar']]
  ]);

  t.deepEqual(p(`{% set foo %}bar{% endset %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Symbol, 'foo'],
      null,
      [Nodes.Capture, [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, 'bar']]]]
    ]
  ]);
});

test('should parse destructured set blocks', t => {
  t.deepEqual(p(`{% set { foo } = bar %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Dict, [Nodes.Symbol, 'foo']],
      [Nodes.Symbol, 'bar']
    ]
  ]);

  t.deepEqual(p(`{% set [ foo ] = bar %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Array, [Nodes.Symbol, 'foo']],
      [Nodes.Symbol, 'bar']
    ]
  ]);
});

test('should compile variable sets', async t => {
  const res = await run('{% set foo = \'bar\' %}{{ foo }}');
  t.is(res, 'bar');
});
