import test from 'ava';
import * as Nodes from '../../nodes/index';
import { ast as p } from '../helpers/parse';

test('should parse an Export node', async t => {
  const str = '{% export { foo, bar } %}';
  t.deepEqual(p(str), [
    Nodes.Root,
    [Nodes.Export, [Nodes.Dict, [Nodes.Symbol, 'foo'], [Nodes.Symbol, 'bar']]]
  ]);
});
