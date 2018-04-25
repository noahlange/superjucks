import test from 'ava';

import * as Nodes from '../../nodes/index';
import { parse as p } from '../helpers/parse';
import run from '../helpers/run';

test('should parse raw', async t => {
  const str = `hello {{ {% %} }}`;
  const foo = await run(`{% raw %}${ str }{% endraw %}`);
  t.is(foo, str);
});

test('should parse raw with broken variables', async t => {
  const str = `{{ x } `;
  const foo = await run(`{% raw %}${ str }{% endraw %}`);
  t.is(foo, str);
});

test('should parse raw with broken blocks', async t => {
  const str = `{% if i_am_stupid }Still do your job well`;
  const foo = await run(`{% raw %}${ str }{% endraw %}`);
  t.is(foo, str);
});

test('should parse raw with pure text', async t => {
  const str = `abc`;
  const foo = await run(`{% raw %}${ str }{% endraw %}`);
  t.is(foo, str);
});

test('should parse raw within raw blocks', async t => {
  const str = `{% raw %}{{ x }}{% endraw %}`;
  const foo = await run(`{% raw %}${ str }{% endraw %}`);
  t.is(foo, str);
});

test('should parse raw with comment blocks', async t => {
  const str = `{# test `;
  const foo = await run(`{% raw %}${ str }{% endraw %}`);
  t.is(foo, str);
});

test('should parse multiple raw blocks', async t => {
  const str = `{{ var }}{% endraw %}{{ foo }}{% raw %}{{ var }}`;
  const foo = await run(`{% raw %}${ str }{% endraw %}`, { foo: 1 });
  t.is(foo, '{{ var }}1{{ var }}');
});

test('should parse multiple multiline raw blocks', async t => {
  const str = `{{ var }}{% endraw %}\n{{ foo }}\n{% raw %}{{ var }}`;
  const foo = await run(`{% raw %}${ str }{% endraw %}`, { foo: 1 });
  t.is(foo, '{{ var }}\n1\n{{ var }}');
});

test('compilation should be a no-op', async t => {
  t.is(new Nodes.Raw(1, 2, {}).compile(null, null), undefined);
});
