import test, { TestContext } from 'ava';
import * as filters from '../filters/index';
import safe from '../filters/safe';
import { brandSafeString } from '../runtime';

test('abs should return the absolute value of a number', t => {
  t.is(filters.abs(-3.5), 3.5);
  t.is(filters.abs('3.5'), 3.5);
  t.is(filters.abs(NaN), NaN);
});

test('append should concatenate two strings', async t => {
  t.is(filters.append('evil wizard ', 'Zargothrax'), 'evil wizard Zargothrax');
});

test('batch should return an n-length array of arrays', async t => {
  const batched = filters
    .batch([1, 2, 3, 4, 5], 2)
    .map(a => a.join(''))
    .join('\n');
  t.is(batched, '123\n45');
});

test('capitalize should naïvely capitalize a string', async t => {
  t.is(filters.capitalize('foobar'), 'Foobar');
});

test('ceil should provide the ceil of an number', async t => {
  t.is(filters.ceil(-3.5), -3);
  t.is(filters.ceil('3.5'), 4);
  t.is(filters.ceil(NaN), NaN);
});

test('center should center a string in another string', async t => {
  t.is(filters.center('ZARGOTHRAX', 4), 'ZARG');
  t.is(filters.center('ZARGOTHRAX', 32), '           ZARGOTHRAX           ');
  t.is(
    filters.center(),
    '                                                                                '
  );
});

test('chunk should chunk an array into n-lengthed arrays', async t => {
  const chunked = filters
    .chunk([1, 2, 3, 4, 5], 2, 'foobar')
    .map(a => a.join(''))
    .join('\n');

  const chunked2 = filters
    .chunk([1, 2, 3, 4], 2)
    .map(a => a.join(''))
    .join('\n');

  t.throws(() => filters.chunk([], -2));
  t.is(chunked, '12\n34\n5foobar');
  t.is(chunked2, '12\n34');
  t.is(filters.chunk(null, 2, '').join(''), '');
});

test('compact should remove duplicates from an array', async t => {
  const compacted = filters
    .compact([1, null, 2, null, 3, null, 4, null, 5, null])
    .join('');
  t.deepEqual(compacted, '12345');
});

test('default should provide a default value for a lookup', async t => {
  t.is(filters.default('hulk', 'smash'), 'hulk');
  t.is(filters.default(undefined, 'smash'), 'smash');
});

test('dictSort should allow the user to sort a dictionary', async t => {
  t.is(
    filters
      .dictSort({ e: 'foo', a: 'bar', c: 'baz', b: 'bye' }, false, 'value')
      .map(a => a[1])
      .join(''),
    'barbazbyefoo'
  );
});

test('dictSort should puke on scalars', t => {
  t.throws(() => filters.dictSort('123' as any));
});

test('should require sorts to be by key or value', t => {
  t.is(
    filters
      .dictSort({ one: 'baz', two: 'bar' }, true, 'key')
      .map(a => a[0])
      .join(''),
    'onetwo'
  );
  t.is(
    filters
      .dictSort({ one: 'baz', two: 3 }, false, 'value')
      .map(a => a[1])
      .join(''),
    'baz3'
  );
  t.is(
    filters
      .dictSort({ one: 2, two: 'bar' }, false, 'value')
      .map(a => a[1])
      .join(''),
    '2bar'
  );
  t.is(
    filters
      .dictSort({ one: 'bar', two: 'bar' }, true, 'value')
      .map(a => a[1])
      .join(''),
    'barbar'
  );
});

test('should require sorts to be by key or value', t => {
  t.throws(() =>
    filters.dictSort(
      [{ one: { foo: 'baz' }, two: { foo: 'bar' } }],
      true,
      'purple' as any
    )
  );
});

test('dump should JSONify an object', async t => {
  t.is(filters.dump({ foo: 'bar' }), JSON.stringify({ foo: 'bar' }, null, 2));
});

test('first should select the first item in an iterable', async t => {
  t.is(filters.first('foobar'), 'f');
});

test('int should coerce a value to an int', async t => {
  t.is(filters.int('234.0'), 234);
  t.is(filters.int('NaN', 'foo'), 'foo');
});

test('float should coerce a value to an float', async t => {
  t.is(filters.float('234'), 234.0);
  t.is(filters.float(234), 234.0);
  t.is(filters.float('HEY-O', 'WHOA'), 'WHOA');
});

test('group by should group an object by an attribute', t => {
  t.deepEqual(
    filters.groupBy(
      [
        { name: 'james', type: 'green' },
        { name: 'john', type: 'blue' },
        { name: 'jim', type: 'blue' },
        { name: 'jessie', type: 'green' }
      ],
      'type'
    ),
    {
      blue: [{ name: 'john', type: 'blue' }, { name: 'jim', type: 'blue' }],
      green: [
        { name: 'james', type: 'green' },
        { name: 'jessie', type: 'green' }
      ]
    }
  );
});

test('join should join an array on a delimeter', async t => {
  t.is(filters.join([1, 2, 3, 4, 5]), '12345');
});

test('join should join an array of objects on a delimeter via a key', async t => {
  t.is(filters.join([{ foo: 'bar' }, { foo: 'baz' }], '|', 'foo'), 'bar|baz');
});

test('last should return the last item in an iterable', async t => {
  const fn = function*() {
    let i = 0;
    while (i <= 10) {
      yield i++;
    }
  };

  t.is(filters.last(fn()), 10);
});

test('lower should lowercase a string', async t => {
  t.is(filters.lower('FoObAr'), 'foobar');
});

test('ltrim should trim the left side of a string', async t => {
  t.is(filters.ltrim('     foo'), 'foo');
});

test('rtrim should trim the right side of a string', async t => {
  t.is(filters.rtrim('foo     '), 'foo');
});

test('map should map an array on a key', async t => {
  t.is(
    filters.map([{ tasty: false }, { tasty: true }], 'tasty').join(''),
    'falsetrue'
  );
});

test('escape should escape html', async t => {
  t.is(filters.escape('<div>').toString(), '&lt;div&gt;');
  const s = brandSafeString('<div>');
  t.is(filters.escape(s), s);
});

test('newlineToBr should replace newlines with <br /> tags', async t => {
  t.is(filters.newlineToBr('\n'), '<br />\n');
  t.is(filters.newlineToBr(null), '');
});

test('prepend should return prepend one string to another', async t => {
  t.is(filters.prepend(' evil wizard', 'Zargothrax'), 'Zargothrax evil wizard');
});

test('random should provide a random element from an array', async t => {
  const arr = [1, 2, 3, 4, 5];
  t.true(arr.indexOf(filters.random(arr)) > -1);
});

test('reject should filter out array items with truthy values', async t => {
  t.is(filters.reject([{ tasty: false }, { tasty: true }], 'tasty').length, 1);
  t.is(filters.reject([ false, true ]).length, 1);
});

test('reject should filter out keys with truthy values', async t => {
  const rejected = filters.reject({ one: true, two: false, three: true });
  t.is(Object.keys(rejected).length, 1);
});

test('reject should filter out keys of items with truthy values', async t => {
  const rejected = filters.reject(
    { one: { tasty: 1 }, two: { tasty: false }, three: { tasty: 1 } },
    'tasty'
  );
  t.is(Object.keys(rejected).length, 1);
});

test('remove should remove all instances of one string from another', async t => {
  t.is(
    filters.remove('Zargothrax the evil wizard Zargothrax', 'Zargothrax'),
    ' the evil wizard '
  );
});

test('round should round a number', async t => {
  t.is(filters.round(4.5), 5);
  t.is(filters.round('4.5'), 5);
});

test('removeFirst should remove the first instance of one string from another', async t => {
  t.is(
    filters.removeFirst('Zargothrax the evil wizard Zargothrax', 'Zargothrax'),
    ' the evil wizard Zargothrax'
  );
});

test('select should filter out array items with falsy values', async t => {
  t.is(filters.select([{ tasty: false }, { tasty: true }], 'tasty').length, 1);
  t.is(filters.select([0, 1]).length, 1);
});

test('select should filter out keys with falsy values', async t => {
  t.is(Object.keys(filters.select({ one: 1, two: 0, three: 1 })).length, 2);
});

test('select should filter out keys of items with falsy values', async t => {
  t.is(
    Object.keys(
      filters.select(
        { one: { tasty: 1 }, two: { tasty: 0 }, three: { tasty: 1 } },
        'tasty'
      )
    ).length,
    2
  );
});

test('slice should slice a string', t => {
  t.is(filters.slice('123'), '123');
});

test('slice should slice a iterable', t => {
  t.deepEqual(filters.slice([ 1, 2, 3 ], 0, 1), [ 1 ]);
});

test('shuffle should shuffle an array', t => {
  const one = '123';
  const two = [ 1, 2, 3 ];
  t.is(filters.shuffle(one).length, 3);
  t.is(filters.shuffle(two).length, 3);
  t.true(filters.shuffle(two).every(item => two.includes(item)));
});

test('sum should sum the properties of an object by key', t => {
  t.is(
    filters.sum([{ one: '1' }, { one: '2' }, { one: '3' }], 'one', ''),
    '123'
  );

  t.is(filters.sum([1, 2, 3, 4, 5]), 15);
});

test('title should change the case of a string to title case', async t => {
  t.is(filters.title('foo bar'), 'Foo Bar');
});

test('wordcount should return the wordcount of a string', async t => {
  t.is(filters.wordcount('foo bar'), 2);
  t.is(filters.wordcount(''), null);
});

test('truncate should truncate a string', async t => {
  const str = 'Long long ago in a galaxy far far away...';
  t.is(filters.truncate(), '');
  t.is(filters.truncate([
    'XOXO ugh single-origin coffee taxidermy unicorn authentic meh dreamcatcher semiotics',
    'mustache palo santo wolf etsy. Selfies asymmetrical la croix echo park, bicycle rights',
    'selvage fam. Prism irony locavore, man bun coloring book cronut pabst YOLO. Raw denim ',
    'banjo shaman semiotics pork belly. Post-ironic keffiyeh man bun cold-pressed small batch ',
    'adaptogen fam selvage copper mug shoreditch beard.'
  ].join(' ')), [
    'XOXO ugh single-origin coffee taxidermy unicorn authentic meh dreamcatcher semiotics',
    'mustache palo santo wolf etsy. Selfies asymmetrical la croix echo park, bicycle rights',
    'selvage fam. Prism irony locavore, man bun coloring book cronut pabst YOLO. Raw denim...'
  ].join(' '));
  t.is(filters.truncate(str, 3, true, '-'), 'Lon-');
  t.is(filters.truncate(str, 3, false, '-'), 'Long-');
  t.is(filters.truncate(str), 'Long long ago in a galaxy far far away...');
});

test('truncate words should truncate x words of arbitrary length to n words', async t => {
  t.is(
    filters.truncateWords('The cat came back the very next day', 4, '...'),
    'The cat came back...'
  );
  t.is(filters.truncateWords(), '');
  t.is(filters.truncateWords('You are tearing me apart, Lisa!'), 'You are tearing...');
  t.is(filters.truncateWords('Oh hi, Mark!', 4), 'Oh hi, Mark!');
});

test('strip tags should stripe the tags from an html string', t => {
  const str = `<span>I'm back in the saddle again!</span>`;
  t.is(filters.stripTags(str, false), `I'm back in the saddle again!`);
});

test('strip tags should stripe the tags from an html string, leaving line breaks intact', t => {
  const str = '<span>I\'m back in the\nsaddle again!</span>';
  t.is(filters.stripTags(str, true), `I'm back in the\nsaddle again!`);
});

test('urlize is not my code and does magical things', t => {
  t.is(
    filters.urlize('foo http://www.example.com bar', Infinity, true),
    `foo <a href="http://www.example.com" rel="nofollow">http://www.example.com</a> bar`
  );
  t.is(
    filters.urlize('foo http://www.example.com/ bar'),
    `foo <a href="http://www.example.com/">http://www.example.com/</a> bar`
  );
  t.is(
    filters.urlize('foo www.example.com bar'),
    `foo <a href="https://www.example.com">www.example.com</a> bar`
  );
  t.is(
    filters.urlize('foo example.com bar'),
    `foo <a href="https://example.com">example.com</a> bar`
  );
  t.is(
    filters.urlize('foo@example.com'),
    `<a href="mailto:foo@example.com">foo@example.com</a>`
  );
});

test('sort should just defer to localeSort', t => {
  t.deepEqual(filters.sort([5, 3, 2, 4, 1]), [1, 2, 3, 4, 5]);
});

test('sortby should allow sorting by property in an array of objects', t => {
  t.deepEqual(filters.sortBy([{ foo: 'mark' }, { foo: 'hi' }], 'foo'), [
    { foo: 'hi' },
    { foo: 'mark' }
  ]);
});

test('safe brands a string as a SafeString (once)', t => {
  const str = filters.safe('FOOBAR');
  t.is(filters.safe(str), str);
});

test('length returns the length of a thingy', t => {
  const arr = [1, 2, 3, 4, 5]; // 5
  const set = new Set(arr); // 5
  const map = new Map([[1, 2], [3, 4]]); // 2
  const hash = { one: 1 }; // 1

  t.is(filters.length(arr), 5);
  t.is(filters.length(set), 5);
  t.is(filters.length(map), 2);
  t.is(filters.length(hash), 1);
});

test('upper should uppercase a string', t => {
  t.is(filters.upper('foo'), 'FOO');
});

test('reverse should reverse a string or array', t => {
  t.is(filters.reverse('foobar'), 'raboof');
  t.deepEqual(filters.reverse([1, 2, 3, 4, 5]), [5, 4, 3, 2, 1]);
});

test('string should stringify a value', t => {
  t.is(filters.string({}), '[object Object]');
  t.is(filters.string(12345), '12345');
});

test('unique should filter out repeated items from an array', t => {
  t.deepEqual(filters.unique([1, 2, 3, 3, 2, 1]), [1, 2, 3]);
});

test('trim newlines should trim a string of line breaks', t => {
  t.is(filters.trimNewlines('foobly\nwoobly'), 'fooblywoobly');
  t.is(filters.trimNewlines('foobly\nwoobly', ' '), 'foobly woobly');
});

test('replace should replace a substring of a string', t => {
  t.is(filters.replace('thisisastringisa', 'isa'), 'thisstring');
  t.is(
    filters.replace('thisisastringisa', 'isa', 'wasa'),
    'thiswasastringwasa'
  );
});

test('replaceFirst should replace the first instance of a substring of a string', t => {
  t.is(filters.replaceFirst('thisisastringisa', 'isa'), 'thisstringisa');
  t.is(
    filters.replaceFirst('thisisastringisa', 'isa', 'wasa'),
    'thiswasastringisa'
  );
});

test('split should split a string into an array', t => {
  t.deepEqual(filters.split('foobar'), ['f', 'o', 'o', 'b', 'a', 'r']);
});

test('urlEncode / UrlDecode should do what they say on the tin', t => {
  t.is(filters.urlDecode('foo%20bar'), 'foo bar');
  t.is(filters.urlEncode('foo bar'), 'foo%20bar');
});
