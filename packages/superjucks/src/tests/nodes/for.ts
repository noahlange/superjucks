import test from 'ava';
import * as Nodes from '../../nodes/index';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

test('should parse for blocks', t => {
  t.deepEqual(p('{% for x of [1, 2] %}{{ x }}{% endfor %}'), [
    Nodes.Root,
    [
      Nodes.For,
      [Nodes.Array, [Nodes.Literal, 1], [Nodes.Literal, 2]],
      [Nodes.Symbol, 'x'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'x']]],
      null,
      null
    ]
  ]);
});

test('should attempt to destructure variables', t => {
  t.deepEqual(
    p('{% for [ x, y ] of [ [ 1, 2 ], [3, 4] ] %}{{ x }}{{ y }}{% endfor %}'),
    [
      Nodes.Root,
      [
        Nodes.For,
        [
          Nodes.Array,
          [Nodes.Array, [Nodes.Literal, 1], [Nodes.Literal, 2]],
          [Nodes.Array, [Nodes.Literal, 3], [Nodes.Literal, 4]]
        ],
        [Nodes.Array, [Nodes.Symbol, 'x'], [Nodes.Symbol, 'y']],
        [
          Nodes.Aggregate,
          [Nodes.Output, [Nodes.Symbol, 'x']],
          [Nodes.Output, [Nodes.Symbol, 'y']]
        ],
        null,
        null
      ]
    ]
  );
});

test('should attempt to destructure variables', t => {
  t.deepEqual(p('{% for { x, y } of [] %}{{ x }}{{ y }}{% endfor %}'), [
    Nodes.Root,
    [
      Nodes.For,
      [Nodes.Array],
      [Nodes.Dict, [Nodes.Symbol, 'x'], [Nodes.Symbol, 'y']],
      [
        Nodes.Aggregate,
        [Nodes.Output, [Nodes.Symbol, 'x']],
        [Nodes.Output, [Nodes.Symbol, 'y']]
      ],
      null,
      null
    ]
  ]);
});

test('should attempt to unpack key-valued objects', t => {
  t.deepEqual(p('{% for x, y of {} %}{{ x }}{{ y }}{% endfor %}'), [
    Nodes.Root,
    [
      Nodes.For,
      [Nodes.Dict],
      [Nodes.Array, [Nodes.Symbol, 'x'], [Nodes.Symbol, 'y']],
      [
        Nodes.Aggregate,
        [Nodes.Output, [Nodes.Symbol, 'x']],
        [Nodes.Output, [Nodes.Symbol, 'y']]
      ],
      null,
      null
    ]
  ]);
});

test('should attempt to unpack key-valued objects', t => {
  t.deepEqual(
    p('{% for await x of asyncGenerator() %}{{ x }}{{ y }}{% endfor %}'),
    [
      Nodes.Root,
      [
        Nodes.For,
        [Nodes.FunctionCall, [Nodes.Symbol, 'asyncGenerator'], [Nodes.List]],
        [Nodes.Symbol, 'x'],
        [
          Nodes.Aggregate,
          [Nodes.Output, [Nodes.Symbol, 'x']],
          [Nodes.Output, [Nodes.Symbol, 'y']]
        ],
        null, // else
        true // async
      ]
    ]
  );
});

test('should throw on old keyword', t => {
  t.throws(() => p('{% for { x, y } in [] %}{{ x }}{{ y }}{% endfor %}'));
});

test('should compile into lib fn call', async t => {
  t.is(
    await run(
      `{%- for a of iterable -%}{{ a }}: (happy!)\n{% else -%}(sad!){%- endfor -%}`,
      { iterable: '12'}
    ),
  '1: (happy!)\n2: (happy!)\n');
});
