import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { ast as p } from '../helpers/parse';

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
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'bar']]]
    ]
  ]);
});

test('should compile into function definition', async t => {
  const ast = new Nodes.Macro(0, 0, {
    args: new Nodes.List(0, 0, {
      children: [
        new Nodes.Symbol(0, 0, { value: 'bar' }),
        new Nodes.Assign(0, 0, {
          target: new Nodes.Symbol(0, 0, { value: 'baz' }),
          value: new Nodes.Literal(0, 0, { value: 2 })
        })
      ]
    }),
    body: new Nodes.Aggregate(0, 0, {
      children: [
        new Nodes.Output(0, 0, {
          children: [
            new Nodes.Symbol(0, 0, { value: 'bar' }),
            new Nodes.Literal(0, 0, { value: 1 })
          ]
        })
      ]
    })
  });
  t.is(
    await compile(ast),
`async (bar, baz = 2) => {
  const buffer = new Buffer();
  buffer.esc(bar);
  buffer.write(1);
  return buffer.out();
}`
  );
});
