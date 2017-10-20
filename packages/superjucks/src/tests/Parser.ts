import test, { TestContext } from 'ava';
import Superjucks from '../configs/Superjucks/Config';
import * as Nodes from '../nodes/index';
import { parse } from '../Parser';
import { ast as p, transform } from './helpers/parse';

test('should parse literal types', t => {
  t.deepEqual(p('{{ 1 }}'), [Nodes.Root, [Nodes.Output, [Nodes.Literal, 1]]]);
  t.deepEqual(p('{{ 4.567 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, 4.567]]
  ]);
  t.deepEqual(p('{{ "foo" }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, 'foo']]
  ]);
  t.deepEqual(p("{{ 'foo' }}"), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, 'foo']]
  ]);
  t.deepEqual(p('{{ true }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, true]]
  ]);
  t.deepEqual(p('{{ false }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, false]]
  ]);
  t.deepEqual(p('{{ null }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, null]]
  ]);
  t.deepEqual(p('{{ foo }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Symbol, 'foo']]
  ]);
  t.deepEqual(p('{{ /23/gi }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, /23/gi]]
  ]);
});

test('should parse aggregate types', t => {
  t.deepEqual(p('{{ [ 1, 2, 3 ] }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [Nodes.Array, [Nodes.Literal, 1], [Nodes.Literal, 2], [Nodes.Literal, 3]]
    ]
  ]);
  t.deepEqual(p('{{ (1,2,3) }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [Nodes.List, [Nodes.Literal, 1], [Nodes.Literal, 2], [Nodes.Literal, 3]]
    ]
  ]);
  t.deepEqual(p(`{{ { hoo, boy } }}`), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Dict, [Nodes.Symbol, 'hoo'], [Nodes.Symbol, 'boy']]]
  ]);

  // this should probably be 'literal', 'literal' unless it has the square
  // brackets
  t.deepEqual(p('{{ { foo: 1, "two": 2 } }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Dict,
        [Nodes.Pair, [Nodes.Symbol, 'foo'], [Nodes.Literal, 1]],
        [Nodes.Pair, [Nodes.Literal, 'two'], [Nodes.Literal, 2]]
      ]
    ]
  ]);
});

test('should parse variables', t => {
  t.deepEqual(p('hello {{ foo }}, how are you?'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, 'hello ']],
    [Nodes.Output, [Nodes.Symbol, 'foo']],
    [Nodes.Output, [Nodes.Literal, ', how are you?']]
  ]);
});

test('should parse basic math operators', t => {
  t.deepEqual(p('{{ 5**3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Pow, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);

  t.deepEqual(p('{{ 5 % 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Mod, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
  t.deepEqual(p('{{ 5 + 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Add, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
  t.deepEqual(p('{{ 5 - 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Sub, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
  t.deepEqual(p('{{ 5 * 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Mul, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
  t.deepEqual(p('{{ 5 / 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Div, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);

  t.deepEqual(p('{{ 5 // 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.FloorDiv, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
});

test('should parse in operator', t => {
  t.deepEqual(p('{{ "smelly" in foo }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.In, [Nodes.Literal, 'smelly'], [Nodes.Symbol, 'foo']]]
  ]);

  t.deepEqual(p('{{ "smelly" not in foo }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [Nodes.Not, [Nodes.In, [Nodes.Literal, 'smelly'], [Nodes.Symbol, 'foo']]]
    ]
  ]);
});

test('should parse "concat" operator', t => {
  t.deepEqual(p('{{ 5~3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Concat, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
});

test('should parse null-coalescing operator', t => {
  t.deepEqual(p('{{ 5 ?? 3 }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [Nodes.NullCoalescing, [Nodes.Literal, 5], [Nodes.Literal, 3]]
    ]
  ]);
});

test('should parse range operator', t => {
  t.deepEqual(p('{{ 5..3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Range, [Nodes.Literal, 5], [Nodes.Literal, 3], false]]
  ]);
  t.deepEqual(p('{{ 5...3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Range, [Nodes.Literal, 5], [Nodes.Literal, 3], true]]
  ]);
});

test('should parse "Elvis" operator', t => {
  t.deepEqual(p('{{ 5 ?: 3 }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Elvis, [Nodes.Literal, 5], [Nodes.Literal, 3]]]
  ]);
});

test('should parse "and" operator', t => {
  t.deepEqual(p('{{ foo and bar }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.And, [Nodes.Symbol, 'foo'], [Nodes.Symbol, 'bar']]]
  ]);
});

test('should parse "await" operator', t => {
  t.deepEqual(p('{{ await promise }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Await, [Nodes.Symbol, 'promise']]]
  ]);

  class Config extends Superjucks {
    public filters = {
      foo: () => true
    };
  }

  t.deepEqual(transform(parse('{{ await bar | foo }}', new Config())) as any, [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Filter,
        [Nodes.Symbol, 'foo'],
        [Nodes.List, [Nodes.Await, [Nodes.Symbol, 'bar']]]
      ]
    ]
  ]);
});

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

test('should throw on unterminated comments', t => {
  t.throws(() => p('{# foo'));
});

test('should throw on improperly terminated tags', t => {
  t.throws(() => p('{% set foo = "bar" 1 %}'));
});
