export default function indent(str: string, indentFirst: true) {
  const out = str.replace(new RegExp('\n', 'g'), '\n  ');
  return indentFirst ? `  ${ out }` : out;
}
