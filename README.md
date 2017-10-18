# {% superjucks %} [WIP]

[![Build Status](https://travis-ci.org/noahlange/superjucks.svg?branch=master)](https://travis-ci.org/noahlange/superjucks)
[![Coverage Status](https://coveralls.io/repos/github/noahlange/superjucks/badge.svg?branch=master)](https://coveralls.io/github/noahlange/superjucks?branch=master)

Superjucks is an *extremely* work-in-progress Jinja-style templating engine based on the Nunjucks codebase. With a flexible parser capable of emulating a variety of Jinja dialects and `async`-aware compilation, it hopes to (eventually) be a versatile and flexible iteration on Mozilla's excellent [Nunjucks](https://github.com/mozilla/nunjucks) templating engine.

```jinja
{% extends 'default.sjk' %}
{% import * as forms from 'forms.sjk' %}

{% macro input(name, value, type = 'text') %}
  <input type="{{ type }}" name="{{ name }}" value="{{ value }}" />
{% endmacro %}

{% block content %}
  <form method="POST" action="/submit">
    {{ input('_method', 'PUT', 'hidden') | safe }}
    {% set { fields } = await forms(model) %}
    {% for f of fields %}
      {% switch f.type %}
        {% case 'select' %}
          <select name="{{ f.name }}">
            {% for await o of f.options() %}
              <option value="{{ o.value }}">
                {{ o.label }}
              </option>
            {% endfor %}
          </select>
        {% default %}
          {{ input(f.name) | safe }}
      {% endswitch %}
    {% endfor %}
  </form>
{% endblock %}

{% export { input as default } %}
```

## Overview
Superjucks aims to be largely compatible with Nunjucks, and semi-compatible
with Jinja, Twig and Liquid.

Moreover, Superjucks hopes to provide several preset configurations that
emulate the syntax, filters, blocks and tests of these other Jinja dialects.
These are semi-implemented works-in-progress, but are (at least the jinja,
Nunjucks and Nunjucks+ flavors) release-blocking priorities.

Entirely new, incompletely-tested features include:
- async/await support
- ES6-esque imports and exports (aliased imports/exports are forthcoming)
- default macro parameters
- `in` for inclusion
- `for-of` for iteration for object literals and objects implementing a
  `[Symbol.iterator]` method
- `for-await-of` for iteration on async generators (you'll need to precompile
  and transpile to use this feature)
- tests
- additional filters from Liquid, Twig and Jinja, including a built-in `date`
  filter powered by `moment.js`
- Liquid/Twig-style inclusive/exclusive range operator (`..`, `...`)
- new blocks ported from Liquid/Jinja/Twig (`switch`, `unless`)

### Imports
```jinja
{# star imports #}
{% import * as foo from 'bar' %}

{# named imports #}
{% import { bar } from 'baz' %}

{# default imports #}
{% import baz from 'foo' %}
```

### Exports
```jinja
{% macro foo(one, two, three = 'four') %}
{% endmacro %}

{# default exports #}
{% export default foo %}

{# named exports #}
{% export { foo } %}

{# multiple exports #}
{% export { foo, bar } %}
```

### Variables and Macros
```jinja
{# destructuring #}
{% set { foo, bar } = baz %}
{% set [ one, two ] = bar %}

{# default macro parameters #}
{% macro input(name, value, type = 'text') %}
  <input type="{{ type }}" name="{{ name }}" value="{{ value }}" />
{% endmacro
```

### Tests
```jinja
{% if foo is defined %}
<p>Foo is defined!</p>
{% else %}
<p>Foo is undefined!</p>
{% endif %}
```

### Keywords
#### await
```jinja
<ul>
  {% for { foo, bar } of iterable %}
    <li>{{ foo }}: {{ await bar() }}</li>
  {% endfor %}
</ul>
```

### Blocks
#### unless
```jinja
{% unless foo or baz %}
  foo {{ bar }} baz
{% endunless %}
```

#### switch/case
```jinja
{% switch foo %}
  {% case 'bar' %}
    bar
  {% case 'baz' %}
    baz
  {% default %}
    neither foo nor bar
{% endswitch %}
```

### Operators
1. [Ternary](https://en.wikipedia.org/wiki/%3F:)
```jinja
{% set foo = bar ? 'bar' : 'baz' %}
{% set foo = bar ? 'bar' %}
```

2. [Elvis](https://en.wikipedia.org/wiki/Elvis_operator)
```jinja
{% set foo = bar ?: 'baz' %}
```

3. [Null-coalescing](https://en.wikipedia.org/wiki/Null_coalescing_operator)
```jinja
{% set foo = bar ?? 'baz' %}
```

## Notable changes

### Operator precedence
1. Filters now have dead-last precedence. This means that if you want filters
take only the nearest left parameter, you'd best put them in parens. This may
be a controversial change, but I haven't been convinced that Jinja got this one
right. This is, of course, customizable based on your config - the Nunjucks/
Nunjucks+/Twig/Jinja/Liquid presets feature filter-first precedence.

```jinja
{# correct  #}
{% 1..5 | join %}

{# correct #}
{% 1..(5 | minus(2)) %}

{# incorrect, can't join number #}
{% 1..(5 | join) %}

{# incorrect, can't subtract from array #}
{% 1..5 | minus(2) %}
```

### Operators
1. `in` → `of`

```jinja
{# iteration #}
{% for foo of bar %}
{% endfor %}

{# async iteration #}
{% for await foo of bar() %}
{% endfor %}

{# inclusion #}
{% if foo in bar %}
{% endif %}
```

### Blocks
1. `verbatim` → `raw`

### Filters
1. `slice` → `chunk`