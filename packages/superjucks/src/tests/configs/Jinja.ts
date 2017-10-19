import test, { TestContext } from 'ava';
import Jinja from '../../configs/Jinja2/Config';
import KeywordArgs from '../../configs/Jinja2/nodes/KeywordArgs';
import Slice from '../../configs/Jinja2/nodes/Slice';
import Parser from '../../configs/Jinja2/Parser';
import { lex } from '../../Lexer';
import * as Nodes from '../../nodes/index';
import { transform } from '../helpers/parse';

export function p(s: string): any {
  const lexer = lex(s);
  const parser = new Parser(lexer, new Jinja());
  const ast = parser.parseAsRoot();
  return transform(ast);
}

test('should parse array slices with start/stop', t => {
  t.deepEqual(p('{% for i in arr[1:4] %}{{ i }}{% endfor %}'), [
    Nodes.Root,
    [
      Nodes.For,
      [
        Nodes.LookupVal,
        [Nodes.Symbol, 'arr'],
        [Slice, [Nodes.Literal, 1], [Nodes.Literal, 4], [Nodes.Literal, null]]
      ],
      [Nodes.Symbol, 'i'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'i']]],
      null,
      null
    ]
  ]);
});

test('should support array slices using expressions', t => {
  t.deepEqual(p('{% for i in arr[n:n+3] %}{{ i }}{% endfor %}'), [
    Nodes.Root,
    [
      Nodes.For,
      [
        Nodes.LookupVal,
        [Nodes.Symbol, 'arr'],
        [
          Slice,
          [Nodes.Symbol, 'n'],
          [Nodes.Add, [Nodes.Symbol, 'n'], [Nodes.Literal, 3]],
          [Nodes.Literal, null]
        ]
      ],
      [Nodes.Symbol, 'i'],
      [Nodes.Aggregate, [Nodes.Output, [Nodes.Symbol, 'i']]],
      null,
      null
    ]
  ]);
});

test('should support None, True and False literals', t => {
  t.deepEqual(p('{{ True }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, true]]
  ]);
  t.deepEqual(p('{{ False }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, false]]
  ]);
  t.deepEqual(p('{{ None }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Literal, null]]
  ]);
});

test('should parse null, true and false as symbols', t => {
  t.deepEqual(p('{{ true }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Symbol, 'true']]
  ]);
  t.deepEqual(p('{{ false }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Symbol, 'false']]
  ]);
  t.deepEqual(p('{{ null }}'), [
    Nodes.Root,
    [Nodes.Output, [Nodes.Symbol, 'null']]
  ]);
});

test('should throw on === and !==', t => {
  t.throws(
    () => p('{{ foo !== "bar" }}'),
    'Unexpected operator "!==" at 1, 10; expected variable end.'
  );
});

test('should cast == and != to strict operators', t => {
  t.deepEqual(p('{{ foo != "bar" }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Compare,
        [Nodes.Symbol, 'foo'],
        [Nodes.CompareOperand, [Nodes.Literal, 'bar'], '!==']
      ]
    ]
  ]);
  t.deepEqual(p('{{ foo == "bar" }}'), [
    Nodes.Root,
    [
      Nodes.Output,
      [
        Nodes.Compare,
        [Nodes.Symbol, 'foo'],
        [Nodes.CompareOperand, [Nodes.Literal, 'bar'], '===']
      ]
    ]
  ]);
});

test('should allow kwargs to be called inside macro', t => {
  t.deepEqual(
    p(
      '{% macro render_div(foo = "bar") %}{{ foo }}{{ kwargs["baz"] }}{% endmacro %}{{ render_div(baz=2) }}'
    ),
    [
      Nodes.Root,
      [
        Nodes.Macro,
        [Nodes.Symbol, 'render_div'],
        [
          Nodes.List,
          [
            KeywordArgs,
            [Nodes.Pair, [Nodes.Symbol, 'foo'], [Nodes.Literal, 'bar']]
          ]
        ],
        [
          Nodes.Aggregate,
          [Nodes.Output, [Nodes.Symbol, 'foo']],
          [
            Nodes.Output,
            [Nodes.LookupVal, [Nodes.Symbol, 'kwargs'], [Nodes.Literal, 'baz']]
          ]
        ]
      ],
      [
        Nodes.Output,
        [
          Nodes.FunctionCall,
          [Nodes.Symbol, 'render_div'],
          [
            Nodes.List,
            [
              KeywordArgs,
              [Nodes.Pair, [Nodes.Symbol, 'baz'], [Nodes.Literal, 2]]
            ]
          ]
        ]
      ]
    ]
  );
});
