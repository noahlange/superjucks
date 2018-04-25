import { Filters, Tests } from 'superjucks-runtime';

import Config from '../../Config';
import * as Nodes from '../../nodes/index';

export const syntax = {
  keywords: {
    AS: 'as',
    DEFAULT: 'default',
    END: 'end',
    IGNORE: 'ignore',
    MISSING: 'missing',
    OF: 'of',
    WILDCARD: '*',
    WITH: 'with',
    WITHOUT: 'without',
  },
  operators: {
    AND: 'and',
    ASSIGN: '=',
    AWAIT: 'await',
    COLON: ':',
    CONCAT: '~',
    DIV: '/',
    ELVIS: '?:',
    EQ: '==',
    EQ_STRICT: '===',
    FLOOR_DIV: '//',
    GT: '>',
    GTE: '>=',
    IN: 'in',
    IS: 'is',
    LT: '<',
    LTE: '<=',
    MINUS: '-',
    MOD: '%',
    MULTIPLY: '*',
    NEQ: '!=',
    NEQ_STRICT: '!==',
    NOT: 'not',
    NULL_COALESCING: '??',
    OR: 'or',
    PIPE: '|',
    PLUS: '+',
    POW: '**',
    QUESTION: '?',
    RANGE_EXCLUSIVE: '...',
    RANGE_INCLUSIVE: '..',
    SUB: '-'
  },
  tags: {
    BLOCK: 'block',
    CASE: 'case',
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
    SET: 'set',
    SWITCH: 'switch',
    UNLESS: 'unless'
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

export default class Superjucks extends Config {
  public syntax = syntax;
  public filters = Filters;
  public tests = Tests;
  public tags = {
    Block: Nodes.Block,
    Export: Nodes.Export,
    Filter: Nodes.Filter,
    For: Nodes.For,
    If: Nodes.If,
    Import: Nodes.Import,
    Macro: Nodes.Macro,
    Raw: Nodes.Raw,
    Set: Nodes.Set,
    Switch: Nodes.Switch,
    Unless: Nodes.Unless
  };
  public operators = [
    Nodes.Filter,
    Nodes.Or,
    Nodes.And,
    Nodes.Not,
    Nodes.In,
    Nodes.Is,
    Nodes.Compare,
    Nodes.Concat,
    Nodes.Add,
    Nodes.Sub,
    Nodes.Mul,
    Nodes.Div,
    Nodes.FloorDiv,
    Nodes.Mod,
    Nodes.Pow,
    Nodes.NullCoalescing,
    Nodes.Elvis,
    Nodes.Ternary,
    Nodes.Range,
    Nodes.Await
  ];
}
