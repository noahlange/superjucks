import test, { TestContext } from 'ava';
import { Environment } from 'superjucks-runtime';

import Config from '../../Config';
import Superjucks from '../../configs/Superjucks/Config';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';

test('should throw when operator not included in config', async t => {
  t.throws(
    () => p('{{ foo ? bar : baz }}', new Config()),
    'Unexpected operator "?" at 1, 8; expected variable end.'
  );
});

test('should parse successfully when operator exists', async t => {
  class WithTernary extends Superjucks {
    public operators = [Nodes.Ternary];
  }
  t.notThrows(() => p('{{ foo ? bar: baz }}', new WithTernary()));
});

test('should parse ternaries', t => {
  t.deepEqual(p('{{ x ? "yes" : "no" }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Ternary,
        [Nodes.Symbol, 'x'],
        [Nodes.Literal, 'yes'],
        [Nodes.Literal, 'no']
      ]
    ]
  ]);
});

test('should compile a ternary node', async t => {
  const condNode = new Nodes.Symbol(0, 0, { value: 'bar' });
  const bodyNode = new Nodes.Literal(0, 0, { value: 'foo' });
  const elseNode = new Nodes.Literal(0, 0, { value: null });
  const astOne = new Nodes.Ternary(0, 0, {
    body: bodyNode,
    cond: condNode,
    else: elseNode
  });
  const astTwo = new Nodes.Ternary(0, 0, {
    body: bodyNode,
    cond: condNode
  });

  t.is(await compile(astOne), 'lookup(\'bar\') ? \'foo\' : null');
  t.is(await compile(astTwo), 'lookup(\'bar\') ? \'foo\' : \'\'');
});
