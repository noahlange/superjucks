import * as moment from 'moment';

export default function date(date: Date, formatString: string) {
  return moment(date).format(formatString);
}
