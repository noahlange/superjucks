import { set } from 'lodash';

export default class Frame {
  public variables: any = {};
  public parent: Frame  | null = null;
  public isolateWrites: boolean;

  public set(name: string, val: string, resolveUp: boolean = false): void {
    // Allow variables with dots by automatically creating the nested structure
    let frame: this | Frame | null = this;
    const obj = this.variables;

    if (resolveUp) {
      frame = this.resolve(name.split('.')[0], true);
      if (frame) {
        frame.set(name, val);
        return;
      }
    }
    set(obj, name, val);
  }

  public get(name: string): any | null {
    const val = this.variables[name];
    return val === undefined ? null : val;
  }

  public resolve(name: string, forWrite?: boolean): null | Frame {
    const p = forWrite && this.isolateWrites ? null : this.parent;
    const val = this.variables[name];
    if (val !== undefined) {
      return this;
    }
    return p && p.resolve(name);
  }

  public lookup(name?: string): any {
    if (name) {
      const p = this.parent;
      const val = this.variables[name];
      if (val !== undefined) {
        return val;
      }
      return p && p.lookup(name);
    }
  }

  public constructor(
    parent?: Frame,
    isolateWrites: boolean = true,
    depth: number = 0
  ) {
    // if this is true, writes (set) should never propagate upwards past
    // this frame to its parent (though reads may).
    this.isolateWrites = isolateWrites;
  }
}
