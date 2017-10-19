import test from 'ava';
import { lex } from '../../Lexer';
import * as Nodes from '../../nodes/index';
import { parse } from '../../Parser';
import { ast as p } from '../helpers/parse';

test('should throw on unnamed wildcards', t => {
  t.throws(() => p("{% import * from 'bar.sjk' %}"));
});

test('should throw on imports without "from"', t => {
  t.throws(() => p("{% import * as bar 'bar.sjk' %}"));
});

test('should throw on imports with wildcards and commas', t => {
  t.throws(() => p("{% import * as bar, baz from 'bar.sjk' %}"));
});

test('should allow multiple imports, so long as the first is a default one', t => {
  t.notThrows(() => p("{% import bar, { baz } from 'bar.sjk' %}"));
});

test('should parse an Import node', t => {
  const str = "{% import * as foo from 'bar.sjk' %}";
  t.deepEqual(p(str), [
    Nodes.Root,
    [
      Nodes.Import,
      [Nodes.Literal, 'bar.sjk'],
      [Nodes.Array, [Nodes.Symbol, 'foo']],
      true
    ]
  ]);
});

test('should parse an Import node', t => {
  const str = "{% import { foo, bar } from 'bar.sjk' %}";
  t.deepEqual(p(str), [
    Nodes.Root,
    [
      Nodes.Import,
      [Nodes.Literal, 'bar.sjk'],
      [Nodes.Array, [Nodes.Dict, [Nodes.Symbol, 'foo'], [Nodes.Symbol, 'bar']]],
      false
    ]
  ]);
});

test('should parse an Import node', t => {
  const str = "{% import { foo, bar, baz, bat } from 'bar.sjk' %}";
  t.deepEqual(p(str), [
    Nodes.Root,
    [
      Nodes.Import,
      [Nodes.Literal, 'bar.sjk'],
      [
        Nodes.Array,
        [
          Nodes.Dict,
          [Nodes.Symbol, 'foo'],
          [Nodes.Symbol, 'bar'],
          [Nodes.Symbol, 'baz'],
          [Nodes.Symbol, 'bat']
        ]
      ],
      false
    ]
  ]);
});
