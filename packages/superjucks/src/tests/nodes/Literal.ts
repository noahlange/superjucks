import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';

test('should compile a literal number', async t => {
  const ast = new Nodes.Literal(0, 0, { value: 1 });
  t.is(await compile(ast), '1');
});

test('should compile a literal string', async t =>{
  const ast = new Nodes.Literal(0, 0, { value: 'foobar' });
  t.is(await compile(ast), '\'foobar\'');
});

test('should compile a literal boolean', async t => {
  const ast = new Nodes.Literal(0, 0, { value: false });
  t.is(await compile(ast), 'false');
});

test('should compile a literal null', async t => {
  const ast = new Nodes.Literal(0, 0, { value: null });
  t.is(await compile(ast), 'null');
});
