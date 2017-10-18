import test from 'ava';
import * as Nodes from '../../nodes/index';
import { ast as p } from '../Parser';

test('should parse set blocks', t => {
  t.deepEqual(p(`{% set foo, baz = bar %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Array, [Nodes.Symbol, 'foo'], [Nodes.Symbol, 'baz']],
      [Nodes.Symbol, 'bar']
    ]
  ]);
  t.deepEqual(p(`{% set foo = bar %}`), [
    Nodes.Root,
    [Nodes.Set, [Nodes.Array, [Nodes.Symbol, 'foo']], [Nodes.Symbol, 'bar']]
  ]);

  t.deepEqual(p(`{% set foo %}bar{% endset %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Array, [Nodes.Symbol, 'foo']],
      null,
      [Nodes.Capture, [Nodes.List, [Nodes.Output, [Nodes.Literal, 'bar']]]]
    ]
  ]);
});

test('should parse destructured set blocks', t => {
  t.deepEqual(p(`{% set { foo } = bar %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Array, [Nodes.Dict, [Nodes.Symbol, 'foo']]],
      [Nodes.Symbol, 'bar']
    ]
  ]);

  t.deepEqual(p(`{% set [ foo ] = bar %}`), [
    Nodes.Root,
    [
      Nodes.Set,
      [Nodes.Array, [Nodes.Array, [Nodes.Symbol, 'foo']]],
      [Nodes.Symbol, 'bar']
    ]
  ]);
});
