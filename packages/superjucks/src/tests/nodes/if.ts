import test from 'ava';
import * as Nodes from '../../nodes/index';
import { ast as p } from '../helpers/parse';

test('should parse if blocks', t => {
  t.deepEqual(p('{% if foo %}{{ foo }}{% else if bar %}{{ bar }}{% endif %}'), [
    Nodes.Root,
    [
      Nodes.If,
      [Nodes.Symbol, 'foo'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'foo']]],
      [
        Nodes.If,
        [Nodes.Symbol, 'bar'],
        [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'bar']]],
        null
      ]
    ]
  ]);

  t.deepEqual(p('{% if foo %}{{ foo }}{% elseif bar %}{{ bar }}{% else %}nada{% endif %}'), [
    Nodes.Root,
    [
      Nodes.If,
      [Nodes.Symbol, 'foo'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'foo']]],
      [
        Nodes.If,
        [Nodes.Symbol, 'bar'],
        [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'bar']]],
        [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, 'nada']]]
      ]
    ]
  ]);
});
