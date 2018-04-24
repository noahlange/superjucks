import test from 'ava';
import * as Nodes from '../../nodes';
import run from '../helpers/run';

test('capture should capture body contents', async t => {
  const tpl = `{%- set foo -%}1 + 2 + 3{%- endset -%}{{ foo }}`;
  const res = await run(tpl);
  t.is(res, '1 + 2 + 3');
});

test('...in a new buffer', async t => {
  const tpl = `{%- set foo -%}1 + 2 + 3{%- endset -%}bar`;
  const res: string = await run(tpl);
  t.is(res, 'bar');
});
