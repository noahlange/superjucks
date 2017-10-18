import Compiler from './Compiler';
import { lex } from './Lexer';
import Node from './Node';
import Parser from './Parser';

export default class Config {

  public syntax: any = {};
  public filters: any = {};
  public globals: any = {};
  public tests: any = {};
  public tags: any = [];
  public operators: any = [];
  public runtime: any;

  public addTest(test: string, fn: any) {
    this.tests[test] = fn;
    return this;
  }

  public hasTest(filter: string) {
    return filter in this.tests;
  }

  public addFilter(filter: string, fn: any) {
    this.filters[filter] = fn;
    return this;
  }

  public hasFilter(filter: string) {
    return filter in this.filters;
  }

  public addTag(tag: string, node: typeof Node) {
    this.tags[tag] = node;
    return this;
  }

  public hasTag(tag: string) {
    return tag in this.tags;
  }

  public addGlobal(name: string, value: any) {
    this.globals[name] = value;
    return this;
  }

  public hasGlobal(g: string) {
    return g in this.globals;
  }
}
