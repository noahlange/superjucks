import test from 'ava';
import Config from '../Config';
import * as Nodes from '../nodes/index';

test('should addFilter/hasFilter', t => {
  const c = new Config();
  const fn = (f: any) => 'foo';
  c.addFilter('foo', fn);
  t.true(c.hasFilter('foo'));
});

test('should addTest/hasTest', t => {
  const c = new Config();
  const fn = (f: any) => 'foo';
  c.addTest('foo', fn);
  t.true(c.hasTest('foo'));
});

test('should addTag/hasTag', t => {
  const c = new Config();
  const fn = (f: any) => 'foo';
  c.addTag('foo', Nodes.And);
  t.true(c.hasTag('foo'));
});

test('should getGlobal/hasGlobal', t => {
  const c = new Config();
  c.addGlobal('foo', 2);
  t.true(c.hasGlobal('foo'));
});
