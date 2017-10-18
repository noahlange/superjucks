export function joinKeywords(one: string | string[], two: string | string[]) {
  const keywordOne = Array.isArray(one) ? one : [ one ];
  const keywordTwo = Array.isArray(two) ? two : [ two ];
  const out = [];
  for (const first of keywordOne) {
    for (const second of keywordTwo) {
      out.push([ first, second ].join(''));
    }
  }
  return out.length === 1 ? out[0] : out;
}
