import test, { TestContext } from 'ava';
import * as Nodes from '../../nodes/index';
import { ast as p } from '../helpers/parse';

test('should parse block tags', t => {
  t.deepEqual(p('{% block foo %}stuff{% endblock %}'), [
    Nodes.Root,
    [
      Nodes.Block,
      [Nodes.Symbol, 'foo'],
      [Nodes.List, [Nodes.Output, [Nodes.Literal, 'stuff']]]
    ]
  ]);
  // and with closing name
  t.deepEqual(p('{% block foo %}stuff{% endblock foo %}'), [
    Nodes.Root,
    [
      Nodes.Block,
      [Nodes.Symbol, 'foo'],
      [Nodes.List, [Nodes.Output, [Nodes.Literal, 'stuff']]]
    ]
  ]);
});
