import test, { TestContext } from 'ava';
import * as Nodes from '../../nodes/index';
import { parse as p } from '../helpers/parse';

test('should parse block tags', t => {
  t.deepEqual(p('{% block foo %}stuff{% endblock %}'), [
    Nodes.Root,
    [
      Nodes.Block,
      [Nodes.Symbol, 'foo'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, 'stuff']]]
    ]
  ]);

  // and with closing name
  t.deepEqual(p('{% block foo %}stuff{% endblock foo %}'), [
    Nodes.Root,
    [
      Nodes.Block,
      [Nodes.Symbol, 'foo'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, 'stuff']]]
    ]
  ]);

  // should throw without name
  t.throws(() => p('{% block %}stuff{% endblock %}'));

  // or with non-symbol name
  t.throws(() => p('{% block 1 %}stuff{% endblock %}'), 'parseBlock: expected symbol, found "1" (1, 2)');

  // or with EOF
  t.throws(() => p('{% block foo %}stuff'), 'parseBlock: expected "endblock", got end of file');
});
