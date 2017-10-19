import * as moment from 'moment';

export default function date(input: Date, formatString: string) {
  return moment(input).format(formatString);
}
