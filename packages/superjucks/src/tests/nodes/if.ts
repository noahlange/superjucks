import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { ast as p } from '../helpers/parse';

test('should parse if blocks', t => {
  t.deepEqual(p('{% if foo %}{{ foo }}{% else if bar %}{{ bar }}{% endif %}'), [
    Nodes.Root,
    [
      Nodes.If,
      [Nodes.Symbol, 'foo'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'foo']]],
      [
        Nodes.If,
        [Nodes.Symbol, 'bar'],
        [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'bar']]],
        null
      ]
    ]
  ]);

  t.deepEqual(
    p(
      '{% if foo %}{{ foo }}{% elseif bar %}{{ bar }}{% else %}nada{% endif %}'
    ),
    [
      Nodes.Root,
      [
        Nodes.If,
        [Nodes.Symbol, 'foo'],
        [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'foo']]],
        [
          Nodes.If,
          [Nodes.Symbol, 'bar'],
          [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'bar']]],
          [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, 'nada']]]
        ]
      ]
    ]
  );
});

test('should compile if blocks', async t => {
  const out = `if (lookup('foo') && lookup('bar')) {
  buffer.esc(await lookup('bar')());
} else {
  if (lookup('baz')) {
    buffer.write('nada');
  }
}
`;

  const ast = new Nodes.If(0, 0, {
    body: new Nodes.Aggregate(0, 0, {
      children: [
        new Nodes.Output(0, 0, {
          children: [
            new Nodes.FunctionCall(0, 0, {
              args: new Nodes.List(0, 0, { children: [] }),
              name: new Nodes.Symbol(0, 0, { value: 'bar' })
            })
          ]
        })
      ]
    }),
    cond: new Nodes.And(0, 0, {
      left: new Nodes.Symbol(0, 0, { value: 'foo' }),
      right: new Nodes.Symbol(0, 0, { value: 'bar' })
    }),
    else: new Nodes.If(0, 0, {
      body: new Nodes.Aggregate(0, 0, {
        children: [
          new Nodes.Output(0, 0, {
            children: [new Nodes.Literal(0, 0, { value: 'nada' })]
          })
        ]
      }),
      cond: new Nodes.Symbol(0, 0, { value: 'baz' })
    })
  });

  t.is(await compile(ast), out);
});
