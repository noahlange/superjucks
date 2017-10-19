import test from 'ava';
import Compiler, { compile } from '../Compiler';
import Superjucks from '../configs/Superjucks/Config';
import Frame from '../Frame';
import * as Nodes from '../nodes/index';

test('compiler should emit inline comments', t => {
  const c = new Compiler();
  c.emitComment('THIS IS SO GREAT');
  t.is(c.buffer.join(''), '// THIS IS SO GREAT\n');
});

test('compiler should emit code with indent callbacks', t => {
  const c = new Compiler();
  c.indent(() => c.emit('THIS IS SO GREAT'));
  t.is(c.buffer.join(''), '  THIS IS SO GREAT');
});

test('compiler should emit code without indents and things', t => {
  const c = new Compiler();
  c.currentIndent = 1;
  c.emit('THIS IS SO GREAT', false);
  t.is(c.buffer.join(''), 'THIS IS SO GREAT');
});

test('compiler should emit code with manual indents and things', t => {
  const c = new Compiler();
  c.currentIndent = 1;
  c.emit('const foo = \'bar\';');
  t.is(c.buffer.join(''), '  const foo = \'bar\';');
});

test('compiler should emit writes', t => {
  const c = new Compiler();
  c.emitWrite(() => c.emit('\'THIS IS SO GREAT\'', false));
  t.is(c.buffer.join(''), 'buffer.write(\'THIS IS SO GREAT\');\n');
});

test('compiler should emit escapes', t => {
  const c = new Compiler();
  c.emitEscape(() => c.emit('\'THIS IS SO GREAT\'', false));
  t.is(c.buffer.join(''), 'buffer.esc(\'THIS IS SO GREAT\');\n');
});

test('compiler#compile() should invoke compile methods of objects', async t => {
  const node = new Nodes.Literal(0, 0, { value: 'CASTING' });
  const frame = new Frame();
  const c = new Compiler();
  await c.compile(node, frame);
  t.is(c.buffer.join(''), '\'CASTING\'');
});

test('compiler#compile() should throw if compile method does not exist', async t => {
  const node = new Nodes.Literal(0, 0, { value: 'CASTING' });
  Object.assign(node, { compile: null });
  const frame = new Frame();
  const c = new Compiler();
  await t.throws(c.compile(node, frame));
});

test('compiler#compile() should throw if compile method breaks', async t => {
  const node = new Nodes.Literal(0, 0, { value: 'CASTING' });
  node.compile = () => {
    throw new Error('Whoopsie!');
  };
  const frame = new Frame();
  const c = new Compiler();
  await t.throws(c.compile(node, frame));
});

test('compiler#getValueOf() should attempt to retrive the value of a node', async t => {
  const literal = new Nodes.Literal(0, 0, { value: 'CASTING' });
  const symbol = new Nodes.Symbol(0, 0, { value: 'GNITSAC' });
  const fn = new Nodes.FunctionCall(0, 0, { name: 'myFn' });
  const c = new Compiler();
  t.is(c.getValueOf(literal), 'CASTING');
  t.is(c.getValueOf(symbol), 'GNITSAC');
  t.is(c.getValueOf(fn), 'myFn');
});

test('compile should attempt to compile a string; currently a no-op', async t => {
  t.is(await compile('{{ foo }}', new Superjucks()), '');
});
