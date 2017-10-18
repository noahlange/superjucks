import test, { TestContext } from 'ava';
import { Environment } from 'superjucks-runtime';

import { compile } from '../../Compiler';
import Config from '../../Config';
import Superjucks from '../../configs/Superjucks/Config';
import * as Nodes from '../../nodes/index';
import { ast as p  } from '../Parser';

test('should throw when operator not included in config', async t => {
  t.throws(
    () => p('{{ foo ? bar : baz }}', new Config()),
    'Unexpected operator "?" at 1, 8; expected variable end.'
  );
});

test('should parse successfully when operator exists', async t => {
  class WithTernary extends Superjucks {
    public operators = [ Nodes.Ternary ];
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
