import test from 'ava';
import * as Nodes from '../../nodes/index';
import { parse as p } from '../helpers/parse';

test('should parse an Export node', async t => {
  const str = '{% export { foo, bar } %}';
  t.deepEqual(p(str), [
    Nodes.Root,
    [Nodes.Export, [Nodes.Dict, [Nodes.Symbol, 'foo'], [Nodes.Symbol, 'bar']]]
  ]);
});

test('should parse an Export node', async t => {
  const str = '{% export default foo %}';
  t.deepEqual(p(str), [
    Nodes.Root,
    [
      Nodes.Export,
      [Nodes.Dict, [Nodes.Pair, [Nodes.Symbol, 'default'], [Nodes.Symbol, 'foo']]]
    ]
  ]);
});
