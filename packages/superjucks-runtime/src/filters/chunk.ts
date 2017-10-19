import * as _ from 'lodash';

export default function chunk(array: any[], count: number, filler: any = '') {
  const res = _.chunk(array, count);
  if (filler) {
    const pop = res.pop();
    if (pop) {
      let toFill = count - pop.length;
      while (toFill--) {
        pop.push(filler);
      }
      res.push(pop);
    }
  }
  return res;
}
