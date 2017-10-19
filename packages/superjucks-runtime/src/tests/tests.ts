import test from 'ava';
import * as tests from '../test/index';
import * as filters from '../filters/index';

test('callable should detect callability', async t => {
  t.is(tests.callable(() => '!!!'), true);
  t.is(tests.callable('!!!'), false);
});

test('defined should detect nulls and undefineds', async t => {
  t.is(tests.defined('!!!'), true);
  t.is(tests.defined(), false);
});

test('divisibleBy should detect whether a number/number-string is divisible by another thing', async t => {
  t.is(tests.divisibleBy('6', 3), true);
  t.is(tests.divisibleBy(4, 3), false);
  t.is(tests.divisibleBy(6, '3'), true);
});

test('escaped should detect whether something is escaped', async t => {
  const escaped = filters.escape('fancy pants');
  t.is(tests.escaped(escaped), true);
  t.is(tests.escaped('fancy pants'), false);
});

test('even should detect whether a number is even', async t => {
  t.is(tests.even('5'), false);
  t.is(tests.even(4), true);
});

test('odd should detect whether a number is odd', async t => {
  t.is(tests.odd('5'), true);
  t.is(tests.odd(4), false);
});

test('falsy should detect whether a value is falsy', async t => {
  t.is(tests.falsy(0), true);
  t.is(tests.falsy('pancakes'), false);
});

test('truthy should detect whether a value is truthy', async t => {
  t.is(tests.truthy(null), false);
  t.is(tests.truthy('pancakes'), true);
});

test('lower should report the lowercaseness of a string', async t => {
  t.is(tests.lower('FRANCIS'), false);
  t.is(tests.lower('francis'), true);
});

test('upper should report the uppercaseness of a string', async t => {
  t.is(tests.upper('FRANCIS'), true);
  t.is(tests.upper('francis'), false);
})

test('greaterThan should detect whether a value is greater than another', async t => {
  t.is(tests.greaterThan(0, 25), false);
  t.is(tests.greaterThan('zero', 'one'), true);
});

test('lessThan should detect whether a value is less than another', async t => {
  t.is(tests.lessThan(0, 25), true);
  t.is(tests.lessThan('zero', 'one'), false);
});

test('iterable should detect whether a value is iterable', async t => {
  const ctx = {
    *fn() {
      let index = 5;
      while (index) {
        yield index--;
      }
    }
  };
  t.is(tests.iterable(ctx.fn), true);
});

test('number should detect whether a value is numeric', async t => {
  t.is(tests.number('3'), false);
  t.is(tests.number(3), true);
});

test('string should detect whether a value is a string', async t => {
  t.is(tests.string('3'), true);
  t.is(tests.string(3), false);
});

test('sameAs should detect whether one value is strictly equal to another', async t => {
  const ctx = {
    bar: 'foo',
    foo: 'foo'
  };
  t.is(tests.sameAs(ctx.bar, ctx.foo), true);
});