import * as escape from 'escape-html';

export default class Buffer {
  private _buf: string[] = [];
  public esc(val: any) {
    const v = escape(val);
    this._buf.push(v === undefined ? '' : v);
  }
  public write(val: any) {
    const v = val;
    this._buf.push(v === undefined ? '' : v);
  }
  public out() {
    return this._buf.join('');
  }
}
