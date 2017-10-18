import { Filters, Tests } from 'superjucks-runtime';

import Config from '../../Config';
import * as Nodes from '../../nodes/index';

const syntax = {
  keywords: {
    AS: 'as',
    DEFAULT: 'default',
    END: 'end',
    IGNORE: 'ignore',
    MISSING: 'missing',
    OF: 'in',
    WILDCARD: '*',
    WITH: 'with',
    WITHOUT: 'without',
  },
  operators: {
    AND: 'and',
    ASSIGN: '=',
    AWAIT: 'await',
    CONCAT: '~',
    DIV: '/',
    EQ: '==',
    EQ_STRICT: '===',
    FLOOR_DIV: '//',
    GT: '>',
    GTE: '>=',
    IN: 'in',
    LT: '<',
    LTE: '<=',
    MINUS: '-',
    MOD: '%',
    MULTIPLY: '*',
    NEQ: '!=',
    NEQ_STRICT: '!==',
    NOT: 'not',
    OR: 'or',
    PIPE: '|',
    PLUS: '+',
    POW: '**'
  },
  tags: {
    BLOCK: 'block',
    DEFAULT: 'default',
    ELSE: 'else',
    ELSEIF: 'elseif',
    EXPORT: 'export',
    EXTENDS: 'extends',
    FILTER: 'filter',
    FOR: 'for',
    FROM: 'from',
    IF: 'if',
    IMPORT: 'import',
    INCLUDE: 'include',
    MACRO: 'macro',
    RAW: 'raw',
    SET: 'set'
  },
  tokens: {
    BLOCK_END: '%}',
    BLOCK_START: '{%',
    COMMENT_END: '#}',
    COMMENT_START: '{#',
    VARIABLE_END: '}}',
    VARIABLE_START: '{{'
  }
};

export default class Nunjucks extends Config {
  public syntax = syntax;
  public filters = {};
  public tests = {};
  public tags = {};
  public operators = [];
}
