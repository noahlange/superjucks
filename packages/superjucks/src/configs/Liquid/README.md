## Literals
### nil
   - nil is the new null.

## Operators
### range
  - range operator
  - triple dots for exclusivity

### contains
  - alias for 'in' operator
  - doesn't overload for Arrays

## Tags

### increment
  - increments symbol by one
  - instantiates number at 0 if necessary)

### decrement
  - decrements symbol by one
  - instantiates number at 0 if necessary

### unless
  - logical opposite of `if`

### capture
  - alias for `set` block

### assign
  - alias for inline `set`

### cycle
```liquid
{% cycle 'one', 'two', 'three' %}
```

### comment

### elsif
  - alias for `elseif` / `else if` / `elif` tag

## case/when/else
  - alias for switch/case/default

### for-in

#### break
  - breaks out of a loop

#### continue
  - skips current iteration of loop

### raw
  - alias for verbatim

#### additional args
  - `limit(num: number)`
  - `offset(num: number)`
  - `reversed()`

### tablerow
  - essentially a for that generates table rows
  - stuffs contents into tablerow variable
  - `{% tablerow in (1..5) %}`

#### additional args
These can be chained indefinitely.
  - `cols(num: number)`
  - `limit(num: number)`
  - `offset(num: number`)

## Notes
- EVERYTHING but `false` and `nil` are truthy
- no support for `{# #}`-style comments
- array brackets are optional
- increment/decrements scope is independent of assign/capture scope
- filter syntax:
- date formatting library
- no math operators - use filters instead
- no tests

## Filters
Don't know if filters can have multiple variables.

```liquid
| bar: ".baz"
```

### escape
  - escapes unescaped string

### escape_once
  - escapes unescaped string, no-op for escaped one

### upcase
  - synonym for uppercase

### downcase
  - synonym for lowercase

### math operators
  - plus
  - minus
  - divided_by
  - times
  - modulo