import test from 'ava';
import { entries } from '../runtime';

test('entries should split non-iterables into iterables', t => {
  const hash = { one: 1, two: 2 };
  t.deepEqual(entries(hash), [ [ 'one', 1 ], [ 'two', 2] ]);
  t.deepEqual(entries(null), []);
  t.deepEqual(entries('foo'), 'foo');
});
