import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

test('should parse is operator', t => {
  t.deepEqual(p('{{ x is callable }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Is, [Nodes.Symbol, 'x'], [Nodes.Symbol, 'callable']]]
  ]);

  t.deepEqual(p('{{ x is not callable(foo) }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Not,
        [
          Nodes.Is,
          [Nodes.Symbol, 'x'],
          [
            Nodes.FunctionCall,
            [Nodes.Symbol, 'callable'],
            [Nodes.List, [Nodes.Symbol, 'foo']]
          ]
        ]
      ]
    ]
  ]);

  t.deepEqual(p('{{ x is not callable or y is callable }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Or,
        [
          Nodes.Not,
          [Nodes.Is, [Nodes.Symbol, 'x'], [Nodes.Symbol, 'callable']]
        ],
        [Nodes.Is, [Nodes.Symbol, 'y'], [Nodes.Symbol, 'callable']]
      ]
    ]
  ]);
});

test('should compile an is-not node', async t => {
  const ast = new Nodes.Not(0, 0, {
    body: new Nodes.Is(0, 0, {
      left: new Nodes.Symbol(0, 0, { value: 'foo' }),
      right: new Nodes.Symbol(0, 0, { value: 'callable' })
    })
  });
  t.is(
    await compile(ast),
    "!((await lib.test('callable', lib.lookup('foo'))) === true)"
  );
});

test('should compile an is-not node', async t => {
  const ast = new Nodes.Is(0, 0, {
    left: new Nodes.Symbol(0, 0, { value: 'foo' }),
    right: new Nodes.FunctionCall(0, 0, {
      args: new Nodes.List(0, 0, { children: [
        new Nodes.Literal(0, 0, { value: 5 })
      ]}),
      name: new Nodes.Symbol(0, 0, { value: 'greaterThan' })
    })
  });
  t.is(
    await compile(ast),
    "(await lib.test('greaterThan', lib.lookup('foo'), 5)) === true"
  );
});

test('should execute a test', async t => {
  const a = await run('{{ foo is defined }}');
  const b = await run('{{ foo is not defined }}');
  t.is(a, 'false');
  t.is(b, 'true');
});
