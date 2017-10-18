import Compiler from '../Compiler';
import Frame from '../Frame';
import Node from '../Node';

import LiteralNode from './Literal';

export default class LookupValueNode extends Node {
  public target: any;
  public value: any;
  public compile() {
    return;
  }
}
