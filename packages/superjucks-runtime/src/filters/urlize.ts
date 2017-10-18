export default function urlize(str: string, length?: number, noFollow?: boolean) {
  if (isNaN(length)) {
    length = Infinity;
  }

  const noFollowAttr = (noFollow === true ? ' rel="nofollow"' : '');

  // For the jinja regexp, see
  // https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
  const puncRE = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
  // from http://blog.gerv.net/2011/05/html5_email_address_regexp/
  const emailRE = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
  const httpHttpsRE = /^https?:\/\/.*$/;
  const wwwRE = /^www\./;
  const tldRE = /\.(?:org|net|com)(?:\:|\/|$)/;

  const words = str.split(/(\s+)/)
    .filter(word => word && word.length)
    .map(word => {
      const matches = word.match(puncRE);
      const possibleUrl = matches && matches[ 1 ] || word;

      // url that starts with http or https
      if (httpHttpsRE.test(possibleUrl)) {
        return '<a href="' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';
      }

      // url that starts with www.
      if (wwwRE.test(possibleUrl)) {
        return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';
      }

      // an email address of the form username@domain.tld
      if (emailRE.test(possibleUrl)) {
        return '<a href="mailto:' + possibleUrl + '">' + possibleUrl + '</a>';
      }

      // url that ends in .com, .org or .net that is not an email address
      if (tldRE.test(possibleUrl)) {
        return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';
      }

      return word;

    });

  return words.join('');
}
