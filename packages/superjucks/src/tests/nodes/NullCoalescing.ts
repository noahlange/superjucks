import test from 'ava';
import Config from '../../Config';
import Superjucks from '../../configs/Superjucks/Config';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

test('should parse ternaries', t => {
  t.deepEqual(p('{{ x ?? "yes" }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [Nodes.NullCoalescing, [Nodes.Symbol, 'x'], [Nodes.Literal, 'yes']]
    ]
  ]);
});

test('should compile a ternary node', async t => {
  const left = new Nodes.Symbol(0, 0, { value: 'bar' });
  const right = new Nodes.Literal(0, 0, { value: 'foo' });
  const astOne = new Nodes.NullCoalescing(0, 0, { left, right });
  t.is(
    await compile(astOne),
    "(lib.lookup('bar') === null || lib.lookup('bar') === undefined) ? 'foo' : lib.lookup('bar')"
  );
});

test('should evaluate a ternary node', async t => {
  t.is(await run('{{ null ?? \'YELLO\' }}'), 'YELLO');
});
