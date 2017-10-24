import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import { parse as p } from '../helpers/parse';

test('should parse an unless node', async t => {
  const ast = [
    Nodes.Root,
    [
      Nodes.Unless,
      [Nodes.Literal, 1],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Literal, '2']]]
    ]
  ];
  t.deepEqual(p('{% unless 1 %}2{% endunless %}'), ast);
});

test('should compile an unless node', async t => {
  const ast = new Nodes.Unless(0, 0, {
    body: new Nodes.Output(0, 0, {
      children: [new Nodes.Literal(0, 0, { value: 2 })]
    }),
    cond: new Nodes.Literal(0, 0, { value: 1 })
  });
  t.is(await compile(ast), 'if (!(1)) {\n  buffer.write(2);\n}');
});
