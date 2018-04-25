import test, { TestContext } from 'ava';
import { Environment } from 'superjucks-runtime';

import Config from '../../Config';
import Superjucks from '../../configs/Superjucks/Config';
import * as Nodes from '../../nodes/index';
import { parse } from '../../Parser';

import compile from '../helpers/compile';
import run from '../helpers/run';

test('should throw when operator not included in config', async t => {
  class NoFilter extends Config {
    public operators = [];
  }
  t.throws(
    () => parse('{{ foo | bar }}', new NoFilter()),
    'Unexpected pipe "|" at 1, 8; expected variable end.'
  );
});

test('should not throw when filter does not exist but parser is loosey-goosey', async t => {
  const config = new Config();
  config.operators.push(Nodes.Filter);
  t.notThrows(
    () => parse('{{ foo | bar }}', config, { strict: false }),
    'Unknown filter "bar" at 1, 8.'
  );
});

test('should throw when filter does not exist', async t => {
  const config = new Config();
  config.operators.push(Nodes.Filter);
  t.throws(
    () => parse('{{ foo | bar }}', config),
    'Unknown filter "bar" at 1, 8.'
  );
});

test('should parse successfully when operator and filter exist', async t => {
  const config = new Config();
  // should find a better API for this -- maybe we can just assume they're kosher until runtime.
  config.operators.push(Nodes.Filter);
  config.addFilter('myFilter', (input: string, num: number) => true);
  t.notThrows(() => parse('{{ foo | myFilter(2) }}', config));
});

test('should compile to a filter call', async t => {
  const ast = new Nodes.Filter(0, 0, {
    args: new Nodes.List(0, 0, { children: [
      new Nodes.Literal(0, 0, { value: null }),
      new Nodes.Literal(0, 0, { value: 'two' }),
    ]}),
    name: new Nodes.Literal(0, 0, { value: 'default' })
  });
  const source = await compile(ast);
  t.is(source, 'await lib.filter(\'default\', null, \'two\')');
});

test('should evaluate a filter function', async t => {
  const two = await run('{{ foo | default("two") }}');
  const three = await run('{{ [ 1, 2, 3 ] | size }}');
  t.is(two, 'two');
  t.is(three, '3');
});

test('should parse and compile filter blocks', async t => {
  t.is(await run('{% filter lower %}FOO{% endfilter %}'), 'foo');
});
