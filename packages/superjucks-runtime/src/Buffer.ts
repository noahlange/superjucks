import * as escape from 'escape-html';

export default class Buffer {
  private _buf: string[] = [];
  public esc(val: any) {
    this._buf.push(escape(val));
  }
  public write(val: any) {
    this._buf.push(val);
  }
  public out() {
    return this._buf.join('\n');
  }
}
