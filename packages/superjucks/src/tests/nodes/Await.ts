import test from 'ava';
import Frame from '../../Frame';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile an "await" node', async t => {
  const frame = new Frame();
  frame.set('promise', Promise.resolve('yay'));
  const ast = new Nodes.Await(0, 0, {
    body: new Nodes.Symbol(0, 0, { value: 'promise' })
  });
  t.is(await compile(ast, frame), 'await promise');
});

test('should compile an "await" node', async t => {
  const ast = new Nodes.Await(0, 0, {
    body: new Nodes.Symbol(0, 0, { value: 'promise' })
  });
  t.is(await compile(ast), 'await lookup(\'promise\')');
});
