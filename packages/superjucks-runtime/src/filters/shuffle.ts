import * as _ from 'lodash';

function shuffle(iterable: string): string;
function shuffle<T>(iterable: T[]): T[];
function shuffle(iterable: string | any[]): string | any[] {
  const spread = [ ...iterable ];
  const shuffled: any[] = _.shuffle(spread);
  return typeof iterable === 'string'
    ? shuffled.join('')
    : shuffled;
}

export default shuffle;
