import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

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
  const out = `if (lib.lookup('foo') && lib.lookup('bar')) {
  buffer.esc(await lib.lookup('bar')());
} else {
  if (lib.lookup('baz')) {
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

test('should evaluate if blocks', async t => {
  const tpl = '{% if foo %}{{ bar }}{% else %}{{ baz }}{% endif %}';
  t.is(await run(tpl, { foo: false, bar: 2, baz: 3 }), '3');
  t.is(await run(tpl, { foo: true, bar: 2, baz: 3 }), '2');
});
