import test from 'ava';
import run from '../helpers/run';

test('should compile property access with strings', async t => {
  const r = await run('{{ foo[\'bar\'] }}', { foo: { bar: 1 }} );
  t.is(r, '1');
});

test('should compile property access with numbers', async t => {
  const r = await run('{{ foo[1] }}', { foo: [ 0, 1 ]} );
  t.is(r, '1');
});

test('should not explode on non-existing properties', async t => {
  const r = run('{{ foo.bar.baz }}', { foo: { bar: null } } );
  t.notThrows(() => r, '');
});

test('should distinguish between dotted key strings and string paths', async t => {
  const ctx = { foo: { ['bar.baz']: false, bar: { baz: true } } };
  const r = await run('{{ foo.bar.baz }} {{ foo["bar.baz"] }}', ctx);
  t.is(r, 'true false');
});
