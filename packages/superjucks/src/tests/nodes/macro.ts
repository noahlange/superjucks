import test from 'ava';
import * as Nodes from '../../nodes/index';
import { ast as p } from '../Parser';

test('should parse default function parameters', t => {
  t.deepEqual(p('{% macro foo(bar, baz = 2) %}{{ bar }}{% endmacro %}'), [
    Nodes.Root,
    [
      Nodes.Macro,
      [Nodes.Symbol, 'foo'],
      [
        Nodes.List,
        [Nodes.Symbol, 'bar'],
        [Nodes.Assign, [Nodes.Symbol, 'baz'], [Nodes.Literal, 2]]
      ],
      [Nodes.List, [Nodes.Output, [Nodes.Symbol, 'bar']]]
    ]
  ]);
});
