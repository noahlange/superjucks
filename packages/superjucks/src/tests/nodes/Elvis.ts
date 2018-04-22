import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';

import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

test('should parse ternaries', t => {
  t.deepEqual(p('{{ x ?: "yes" }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Elvis, [Nodes.Symbol, 'x'], [Nodes.Literal, 'yes']]]
  ]);
});

test('should compile a elvis node', async t => {
  const left = new Nodes.Symbol(0, 0, { value: 'bar' });
  const right = new Nodes.Literal(0, 0, { value: 'foo' });
  const astOne = new Nodes.Elvis(0, 0, { left, right });
  t.is(await compile(astOne), '(lib.lookup(\'bar\') || \'foo\')');
});

test('should evaluate an elvis node', async t => {
  t.is(await run("{{ 'HELLO' ?: 'YELLO' }}"), 'HELLO');
  t.is(await run("{{ '' ?: 'YELLO' }}"), 'YELLO');
});
