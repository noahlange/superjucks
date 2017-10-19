import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile "=" operator', async t => {
  const frame = new Frame();
  frame.set('foo', 'bar');
  const ast = new Nodes.Assign(0, 0, {
    target: new Nodes.Symbol(0, 0, { value: 'foo' }),
    value: new Nodes.Literal(0, 0, { value: 3 })
  });
  t.is(await compile(ast, frame), 'foo = 3');
});
