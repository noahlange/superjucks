import test from 'ava';
import { brandSafeString, contains, copySafeness, entries, iterasync, itersync, range } from '../runtime';

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
  t.is(copySafeness(bone, two).__superjucks_escaped__, true);
});

test('range should generate an array of numbers', async t => {
  const r1 = range(-4, 4, 2, true);
  const r2 = range(-3, 3, 2, false);
  const r3 = range(-3, 3);
  t.deepEqual(r1, [ -4, -2, 0, 2, 4 ]);
  t.deepEqual(r2, [ -3, -1, 1 ]);
  t.deepEqual(r3, [ -3, -2, -1, 0, 1, 2 ]);
});

test('sync should iterate through a synchronous iterator', async t => {
  const a = [];
  const b = [];
  const x = [ 1, 2, 3, 4, 5 ];
  const y = '';

  itersync(x, item => {
    a.push(item);
  }, () => a.push('☹️'));

  itersync(y, item => {
    b.push(item);
  }, () => b.push('☹️'));

  t.deepEqual(a, x);
  t.deepEqual(b, [ '☹️' ]);
});

test('async should iterate through an asynchronous iterator', async t => {
  const z = async function*(item) {
    for (const i of item) {
      yield i;
    }
  };

  const a = [];
  const b = [];
  const x = [ 1, 2, 3, 4, 5 ];
  const y = '';

  await iterasync(z(x), item => {
    a.push(item);
  }, () => a.push('☹️'));

  await iterasync(z(y), item => {
    b.push(item);
  }, () => b.push('☹️'));

  t.deepEqual(a, [ 1, 2, 3, 4, 5 ]);
  t.deepEqual(b, [ '☹️' ]);
});
