import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile "===" operator', async t => {
  const ast = new Nodes.Compare(0, 0, {
    expr: new Nodes.Literal(0, 0, { value: 5 }),
    ops: [
      new Nodes.CompareOperand(0, 0, {
        expr: new Nodes.Literal(0, 0, { value: 3 }),
        type: '==='
      })
    ]
  });
  t.is(await compile(ast), '5 === 3');
});
