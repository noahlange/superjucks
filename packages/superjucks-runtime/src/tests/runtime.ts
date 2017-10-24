import test from 'ava';
import { brandSafeString, contains, copySafeness, entries } from '../runtime';

test('entries should split non-iterables into iterables', t => {
  const hash = { one: 1, two: 2 };
  t.deepEqual(entries(hash), [ [ 'one', 1 ], [ 'two', 2] ]);
  t.deepEqual(entries(null), []);
  t.deepEqual(entries('foo'), 'foo');
});

test('contains should test inclusion', t => {
  t.false(contains('foo', 'bar'));
  t.true(contains('12345', '123'));
  t.false(contains([ 1, 2, 3 ], 4));
  t.true(contains([ 1, 2, 3 ], 2));
  t.true(contains(new Map([ [ 'foo', 'bar' ]]), 'foo'));
  t.true(contains(new Set([ 'foo', 'bar' ]), 'foo'));
  t.true(contains({ hi: 'bye' }, 'hi'));
  t.throws(() => contains(1, 2));
});

test('copySafeness should copy safeness from one string to another', async t => {
  const one = 'one';
  const two = 'two';
  const bone = brandSafeString(one);
  const btwo = brandSafeString(two);
  t.is(copySafeness(one, two), two);
  t.is(copySafeness(bone, btwo), btwo);
  t.is(copySafeness(one, btwo), two);
  t.is(copySafeness(bone, two).__superjucks__escaped__, true);
});
