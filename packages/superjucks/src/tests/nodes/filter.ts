import test, { TestContext } from 'ava';
import { Environment } from 'superjucks-runtime';

import { compile } from '../../Compiler';
import Config from '../../Config';
import Superjucks from '../../configs/Superjucks/Config';
import * as Nodes from '../../nodes/index';
import { parse } from '../../Parser';

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
  // should find a better API for this
  config.operators.push(Nodes.Filter);
  config.addFilter('myFilter', (input: string, num: number) => true);
  t.notThrows(() => parse('{{ foo | myFilter(2) }}', config));
});
