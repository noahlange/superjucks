import Config from '../../Config';
import * as Nodes from '../../nodes/index';
import Slice from './nodes/Slice';
import Parser from './Parser';

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
    EQ_STRICT: '==',
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
    NEQ_STRICT: '!=',
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

export default class Jinja2 extends Config {
  public tags = {
    For: Nodes.For,
    Macro: Nodes.Macro,
  };
  public syntax = syntax;
  public operators = [
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
    Nodes.Filter
  ];
}
