import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { ast as p } from '../helpers/parse';

test('should parse switch blocks', t => {
  t.deepEqual(
    p(
      `{% switch foo %}{% case "bar" %} BAR{% case "baz" %} BAZ{% default %} NEITHER FOO NOR BAR{% endswitch %}`
    ),
    [
      Nodes.Root,
      [
        Nodes.Switch,
        [Nodes.Symbol, 'foo'],
        // This has been spread because we spreaded an apply.
        // It makes most other things much way more compact, but
        // makes this nonsensical. In the AST, these cases are
        // wedged into an array and not separate fields on the node.
        [
          Nodes.Case,
          [Nodes.Literal, 'bar'],
          [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, ' BAR']]]
        ],
        [
          Nodes.Case,
          [Nodes.Literal, 'baz'],
          [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, ' BAZ']]]
        ],
        [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, ' NEITHER FOO NOR BAR']]]
      ]
    ]
  );
});

test('should parse switch blocks without default cases', t => {
  t.deepEqual(
    p(
      `{% switch foo %}{% case "bar" %} BAR{% case "baz" %} BAZ{% endswitch %}`
    ),
    [
      Nodes.Root,
      [
        Nodes.Switch,
        [Nodes.Symbol, 'foo'],
        // ditto
        [
          Nodes.Case,
          [Nodes.Literal, 'bar'],
          [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, ' BAR']]]
        ],
        [
          Nodes.Case,
          [Nodes.Literal, 'baz'],
          [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, ' BAZ']]]
        ],
        null
      ]
    ]
  );
});

test('should throw on blocks without endswitches', t => {
  t.throws(() => p(`{% switch foo %}{% case "bar" %} BAR{% case "baz" %} BAZ`));
});

test('should throw on blocks that start with something other than a case or default', t => {
  t.throws(() => p(`{% switch foo %}{% set foo = "bar" %}{% endswitch %}`));
});

test('case should compile to the case body', async t => {
  const body = new Nodes.Literal(0, 0, { value: 42 });
  const ast = new Nodes.Case(0, 0, { body });
  t.is(await compile(ast), '42');
});
