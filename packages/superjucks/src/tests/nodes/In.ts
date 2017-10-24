import test from 'ava';
import * as Nodes from '../../nodes/index';
import compile from '../helpers/compile';
import run from '../helpers/run';

test('should evaluate an in node', async t => {
  t.is(await run('{{ \'1\' in \'123\' }}'), 'true');
  t.is(await run('{{ \'1\' not in \'123\' }}'), 'false');
});
